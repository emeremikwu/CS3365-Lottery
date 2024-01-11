/* eslint-disable max-len */
import status from 'http-status';
import _ from 'lodash';
import {
	Ticket, TicketType, CartItem, Order, OrderItem,
} from '../models/associations.js';
import logger from '../config/logger.js';
import TicketDNEError from '../utils/errors/ticketDNEError.js';
import sequelize from '../config/sequelize.js';
import APIError from '../utils/errors/apiError.js';
import InvalidCartIndexError from '../utils/errors/invalidCartIndexError.js';
import EmptyCartError from '../utils/errors/emptyCartError.js';
import { generateRefernceNumber } from '../utils/ticket/ticketNumberTools.js';

/*
    TODO: implementing caching, see others below
            when a user requests their cart, it returns the index of the CartItems in the db. This value doesn't start form one
        [x] - set ticket refernce Number during checkout
        [ ] - implement caching
        [x] - updateItemQuantity doesn't check for incorrect index, will be updated after first todo is implemented
 */

// -[ ] replace with cache
// create dictionary of type prices,
const ticket_type_prices = {};
TicketType.findAll({ attributes: ['type_id', 'price'] })
	.then((ticket_types) => ticket_types.forEach((ticket_type) => {
		ticket_type_prices[ticket_type.type_id] = parseFloat(ticket_type.price);
	}));

export class CartController {
	// [ ] - update CartItems Model to return a local index rather then global(cart_item_id),
	// [x] - return subtotal
	static async getCart(req, res) {
		let subtotal = 0;
		let index = 0;
		const cartItems = req.user.userCart.CartItems.map((current_item) => {
			subtotal += ticket_type_prices[current_item.ticket_type_id] * current_item.quantity;
			index += 1;

			return {
				index,
				// The amount they are buying
				quantity: current_item.quantity,
				// info of the ticket the user plans on buying
				ticket_info: current_item.TicketType,
			};
		});

		return res.json({
			subtotal,
			cart_items: cartItems,
		});
	}

	// post
	static async addToCart(req, res) {
		const ticket_type_id = req.body.ticket_type_id || req.query.ticket_type_id;
		const quantity = req.body.quantity || req.query.quantity;

		// check if the ticket exists, temporary solution, eventually thiw will be cacahed
		const ticket_type = await TicketType.findByPk(ticket_type_id);

		if (!ticket_type) throw new TicketDNEError();

		// Find or create the cart item
		const [cartItem, created] = await CartItem.findOrCreate({
			where: {
				cart_id: req.user.cart_id, // we ensured that the user has a cart in the middleware
				ticket_type_id,
			},
		});

		// set or update if it exists
		if (created) {
			cartItem.quantity = quantity;
		} else {
			cartItem.quantity += quantity;
		}

		await cartItem.save();

		// response
		res.status(status.CREATED).json({
			message: 'Added to cart',
		});
	}

	/*
        PATCH method
        For now, we're assuming that either a cart_item or ticket_type id is provided.
        This will be validated later using validators and Joi.

        This implementation because there can only be one type of each at a time.
    */
	static async updateItemQuantity(req, res) {
		/* const {
			cart_item_id,
			ticket_type_id,
			quantity,
		} = req.body; */

		const index = (req.body.index || req.query.index) - 1;
		const quantity = req.body.quantity || req.query.quantity;

		const cartItems = await CartItem.findAll({
			where: {
				cart_id: req.user.cart_id,
				// might xor these in validations later or remove cart_item_id all together
			},

			order: [['cart_item_id', 'ASC']],
		});

		// error handling
		// I dont think this case is possible
		if (!cartItems) throw new APIError('Internal Server Error', status.INTERNAL_SERVER_ERROR, false);
		if (!cartItems.length) throw new EmptyCartError();
		if (index > cartItems.length || index < 0) throw new InvalidCartIndexError(null, index);

		let retStatus = status.OK;

		// if quantity is not equal to 0, update, else destory
		if (quantity) {
			cartItems[index].quantity = quantity;
			await cartItems[index].save();
		} else {
			cartItems.destroy();
			retStatus = status.NO_CONTENT;
		}

		const responseObject = _.pick(cartItems[index], ['quantity', 'ticket_type_id']);
		Object.assign(responseObject, { index: index + 1 });

		res.status(retStatus).json({
			message: `Cart item ${quantity ? 'updated' : 'deleted'}`,
			...(retStatus !== status.NO_CONTENT && { cart_item: responseObject }),
		});
	}

	/*
    POST method
        Checkout Steps
        1. Get User Cart -> logic moved to middleware
        2. Get Cart Item -> Extract Ticket types
        3. Create Order
        4. Create Order Items & Tickets (combined)
        5. Delete Cart Items
        6. Delete Cart (optional)
        7. Return Created Order and Order Item

    FIXME: Cache ticket_type_prices to avoid calling the Database every time a user checksout
     */
	static async checkout(req, res) {
		// ----- Get cart items -----
		// filtered cart defined in middlware
		const cartItems = req.user.userCart.CartItems.map((current_item) => ({
			ticket_type_id: current_item.ticket_type_id,
			quantity: current_item.quantity,
		}));

		// ----- Extract Tickets -----
		// sets an array of ticket types from each cart item since there can be n amount of tickets
		let subtotal = 0;
		const extracted_tickets = cartItems.flatMap(
			(current_item) => {
				subtotal += ticket_type_prices[current_item.ticket_type_id] * current_item.quantity;

				return Array.from(
					{ length: current_item.quantity },
					() => ({ ticket_type_id: current_item.ticket_type_id }),
				);
			},
		);

		let order_id = null;
		// wrap in a transaction so everything either passes for fails
		await sequelize.transaction(async (t) => {
			// ----- Create Order -----
			const order = await Order.create({
				user_id: req.user.user_id,
				subtotal,
			}, { transaction: t });
			order_id = order.order_id;

			/*  - combine the creation of Tickets and OrderItems in the same bulkCreate
			    - if I'm understanding this correctly,
                    this works because OrderItems references tickets (fk ticket_id)
                    there for assigning foreign keys accordingly
            */
			await Ticket.bulkCreate(
				extracted_tickets.map((current_ticket) => {
					const ref = generateRefernceNumber(
						current_ticket.ticket_type_id,
						order.order_id,
						order.date.toISOString(),
						req.user.user_id,
					);

					return {
						...current_ticket,
						ticket_reference_number: ref,
						// specify the information needed for OrderItems
						OrderItems: [{ order_id: order.order_id }],
					};
				}),
				{ include: OrderItem, transaction: t },
			);

			await CartItem.destroy({ where: { cart_id: req.user.cart_id } }, { transaction: t });
		});

		logger.info(`Order Created: ref: ${order_id} UID: ${req.user.user_id}`);

		res.status(status.CREATED).json({
			message: 'Order Created',
			subtotal,
			ref: order_id,
		});
	}
}

export default CartController;
