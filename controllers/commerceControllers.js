"use strict";

import status from "http-status";

import models from "../models/associations.js"
import logger from "../config/logger.js";
import mariadb_connector from "../config/maria_db.js";
import EmptyCartError from "../utils/errors/emptyCartError.js";
import TicketDNEError from "../utils/errors/ticketDNEError.js";

/* 
    TODO: 
        [ ] - update CartItems Model to have a local index and a global index,
            when a user requests their cart, it returns the index of the CartItems in the db. This value doesn't start form one
        [ ] - set ticket refernce Number during checkout
        [ ] - implement caching
        [ ] - updateItemQuantity doesn't check for incorrect index, will be updated after first todo is implemented
 */

export class CommerceControllers {

    static async getCart(req, res, next) {

        const userCart = await req.user.getCart({
            include: {
                model: models.CartItems,    //model name is cart_items
                include: {
                    model: models.TicketType,
                    attributes: ["name", "price", "description", "type_id"],
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });

        const cartItems = userCart.CartItems.map((current_item) => ({
            // The id of the cart item so we can delete or update it
            cart_item_id: current_item.cart_item_id,

            // info of the ticket the user plans on buying
            ticket_info: current_item.TicketType,

            // The amount they are buying
            quantity: current_item.quantity,
        }));

        return res.json(cartItems);
    }

    //post
    static async addToCart(req, res, next) {
        const {
            ticket_type_id,
            quantity,
        } = req.body

        //check if the ticket exists, temporary solution, eventually thiw will be cacahed
        const ticket_type = await models.TicketType.findByPk(ticket_type_id)

        if (!ticket_type) throw new TicketDNEError()

        const [cartItem, created] = await models.CartItems.findOrCreate({
            where: {
                cart_id: req.user.cart_id, //we ensured that the user has a cart in the middleware 
                ticket_type_id: ticket_type_id
            }
        })

        if (created) {
            cartItem.quantity = quantity
        } else {
            cartItem.quantity += quantity
        }

        await cartItem.save()

        res.status(status.CREATED).json({
            status: status.CREATED,
            message: "Added to cart",
            cart_item: cartItem,
        })
    }

    /* 
        PATCH method
        for now we'er assuming that either a cart_item or ticket_type id is proivded
        this will be validated later using validators and Joi

        this implementation because there can only be one type of each at a time
    */
    static async updateItemQuantity(req, res, next) {
        const {
            cart_item_id,
            ticket_type_id,
            quantity
        } = req.body

        const cartItem = await models.CartItems.findOne({
            where: {
                cart_id: req.user.cart_id,
                // might xor these in validations later
                ...(!!cart_item_id && { cart_item_id }),
                ...(!!ticket_type_id && { ticket_type_id }),
            }
        })

        if (!cartItem) {
            return res.status(status.NOT_FOUND).json({
                status: status.NOT_FOUND,
                message: "Cart item not found"
            })
        }

        //if quantity is equal to zero
        if (quantity) {
            cartItem.quantity = quantity
            await cartItem.save()
        } else {
            cartItem.destroy()
        }
        res.status(status.OK).json({
            status: status.OK,
            message: `Cart item ${quantity ? "updated" : "deleted"}`,
            cart_item: cartItem,
        })
    }

    /* 
    POST method
        Checkout Steps
        1. Get User Cart
        2. Get Cart Item -> Extract Ticket types
        3. Create Order
        4. Create Order Items & Tickets (combined)
        5. Delete Cart Items
        6. Delete Cart (optional)
        7. Return Created Order and Order Item

    FIXME: Cache ticket_type_prices to avoid calling the Database every time a user checksout
     */
    static async checkout(req, res, next) {

        //create dictionary of type prices,
        const ticket_type_prices = {}
        models.TicketType.findAll({ attributes: ["type_id", "price"] })
            .then((ticket_types) =>
                ticket_types.forEach((ticket_type) => {
                    ticket_type_prices[ticket_type.type_id] = parseFloat(ticket_type.price)
                })
            )

        // ----- get user cart ----- 
        const userCart = await req.user.getCart({
            include: {
                model: models.CartItems,
                include: {
                    model: models.TicketType,
                    attributes: ["name", "price", "description", "type_id"],
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        // Check if cart is empty
        if (!userCart.CartItems.length) throw new EmptyCartError()

        // ----- Get cart items ----- 
        const cartItems = userCart.CartItems.map((current_item) => ({
            ticket_type_id: current_item.ticket_type_id,
            quantity: current_item.quantity,
        }))

        // ----- Extract Tickets ----- 
        // sets an array of ticket types from each cart item since there can be n amount of tickets
        let subtotal = 0;
        const extracted_tickets = cartItems.flatMap(
            (current_item) => {
                subtotal += ticket_type_prices[current_item.ticket_type_id] * current_item.quantity

                return Array.from({ length: current_item.quantity },
                    () => ({ ticket_type_id: current_item.ticket_type_id })
                )
            }
        )

        let order_id = null
        // wrap in a transaction so everything either passes for fails
        await mariadb_connector.sequelize.transaction(async t => {
            // ----- Create Order ----- 
            const order = await models.Orders.create({
                user_id: req.user.user_id,
                subtotal,
            }, { transaction: t })
            order_id = order.order_id

            // combine the creation of Tickets and OrderItems in the same bulkCreate
            // if I'm understanding this correctly, this works because OrderItems references tickets (fk ticket_id)
            await models.Ticket.bulkCreate(
                extracted_tickets.map((current_ticket) => ({
                    ...current_ticket,
                    OrderItems: [{ order_id: order.order_id }] // specify the information needed for OrderItems
                })),
                { include: models.OrderItems, transaction: t }
            )

            await models.CartItems.destroy({ where: { cart_id: req.user.cart_id } }, { transaction: t })

        })

        logger.info(`Order Created: ref: ${order_id}`)

        res.status(status.CREATED).json({
            message: "Order Created",
            subtotal: subtotal,
            ref: order_id,
        })

    }

}
export default CommerceControllers