/* eslint-disable max-len */
import status from 'http-status';
import {
	Ticket, TicketType, CartItem, Order, OrderItem,
} from '../models/associations.js';
import { logger } from '../config/logger.js';
import TicketDNEError from '../utils/errors/ticketDNEError.js';
import sequelize from '../config/sequelize.js';

/*
    TODO: implementing caching, see others below
            when a user requests their cart, it returns the index of the CartItems in the db. This value doesn't start form one
        [ ] - set ticket refernce Number during checkout
        [ ] - implement caching
        [ ] - updateItemQuantity doesn't check for incorrect index, will be updated after first todo is implemented
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
		const cartItems = req.user.filteredCart.CartItems.map((current_item) => {
			subtotal += ticket_type_prices[current_item.ticket_type_id] * current_item.quantity;

			return {
				// The id of the cart item so we can delete or update it
				cart_item_id: current_item.cart_item_id,

				// info of the ticket the user plans on buying
				ticket_info: current_item.TicketType,

				// The amount they are buying
				quantity: current_item.quantity,
			};
		});

		return res.json({
			cartItems,
			subtotal,
		});
	}

	// post
	static async addToCart(req, res) {
		const {
			ticket_type_id,
			quantity,
		} = req.body;

		// check if the ticket exists, temporary solution, eventually thiw will be cacahed
		const ticket_type = await TicketType.findByPk(ticket_type_id);

		if (!ticket_type) throw new TicketDNEError();

		// Find or create the cart item
		const [existingCartItem, created] = await CartItem.findOrCreate({
			where: {
				cart_id: req.user.cart_id, // we ensured that the user has a cart in the middleware
				ticket_type_id,
			},
		});

		// set or update if it exists
		if (created) {
			existingCartItem.quantity = quantity;
		} else {
			existingCartItem.quantity += quantity;
		}

		await existingCartItem.save();

		// response
		res.status(status.CREATED).json({
			message: 'Added to cart',
			cart_item: existingCartItem,
		});
	}

	/*
        PATCH method
        For now, we're assuming that either a cart_item or ticket_type id is provided.
        This will be validated later using validators and Joi.

        This implementation because there can only be one type of each at a time.
    */
	static async updateItemQuantity(req, res) {
		const {
			cart_item_id,
			ticket_type_id,
			quantity,
		} = req.body;

		const cartItem = await CartItem.findOne({
			where: {
				cart_id: req.user.cart_id,
				// might xor these in validations later or remove cart_item_id all together
				...(!!cart_item_id && { cart_item_id }),
				...(!!ticket_type_id && { ticket_type_id }),
			},
		});

		if (!cartItem) {
			res.status(status.NOT_FOUND).json({
				message: 'Cart item not found',
			});
			return;
		}

		let retStatus = status.OK;

		// if quantity is equal to zero
		if (quantity) {
			cartItem.quantity = quantity;
			await cartItem.save();
		} else {
			cartItem.destroy();
			retStatus = status.NO_CONTENT;
		}

		res.status(retStatus).json({
			message: `Cart item ${quantity ? 'updated' : 'deleted'}`,
			...(retStatus !== status.NO_CONTENT && { cart_item: cartItem }),
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
		const cartItems = req.user.filteredCart.CartItems.map((current_item) => ({
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
				extracted_tickets.map((current_ticket) => ({
					...current_ticket,
					// specify the information needed for OrderItems
					OrderItems: [{ order_id: order.order_id }],
				})),
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
