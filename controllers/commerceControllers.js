"use strict";

import status from "http-status";
import { DateTime } from "luxon";


import {
    Cart,
    CartItems,
    TicketType,
    Orders,
    OrderItems,
    Ticket
} from "../models/associations.js";
import logger from "../config/logger.js";

/* 
    TODO: 
        [ ] - cart_item_id doesn't automaticallty increment/decrement upon item deletion. 
            Implement something that offloads this to another processor
        [ ] - set ticket refernce Number
 */

export class CommerceControllers {

    static async getCart(req, res, next) {

        const userCart = await req.user.getCart({
            include: {
                model: CartItems,    //model name is cart_items
                include: {
                    model: TicketType,
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

        const [cartItem, created] = await CartItems.findOrCreate({
            where: {
                cart_id: req.user.cart_id, //we ensure that the user has a cart in the middleware 
                ticket_type_id: ticket_type_id
            }
        })

        if (created) {
            cartItem.quantity = quantity
            await cartItem.save()
        } else {
            cartItem.quantity += quantity
            await cartItem.save()
        }

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

        const cartItem = await CartItems.findOne({
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

    // POST method

    /* static async checkout(req, res, next) {
        const {
            cart_id,
            payment_method,
            payment_info,
        } = req.body;

        const user_cart = await req.user.getCart({
            include: {
                model: CartItem,
                include: {
                    model: TicketType,
                    attributes: ["name", "price", "description", "type_id"],
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });

        const cart_items = user_cart.cart_items.map((current_item) => ({
            // The id of the cart item so we can delete or update it
            cart_item_id: current_item.cart_item_id,

            // info of the ticket the user plans on buying
            ticket_info: current_item.ticket_type,

            // The amount they are buying
            quantity: current_item.quantity,
        }));

        //create order
        const order = await Orders.create({
            user_id: req.user.user_id,
            payment_method: payment_method,
            payment_info: payment_info,
        });

        //create order items
        const order_items = cart_items.map((current_item) => ({
            order_id: order.order_id,
            ticket_type_id: current_item.ticket_info.type_id,
            quantity: current_item.quantity,
        }));

        //create order items
        await OrderItems.bulkCreate(order_items);

        //delete cart items
        await CartItem.destroy({
            where: {
                cart_id: req.user.cart_id,
            },
        });

        return res.json({
            order_id: order.order_id,
            order_items: order_items,
        });
    } */

    /* 
        FIXME: Cache ticket_type_prices to avoid calling the Database every time a user checksout
     */
    static async checkout(req, res, next) {
        /* Checkout Steps
            1. Get User Cart
            2. Get Cart Item -> Extract Ticket types
            3. Create Order
            4. Create Order Items
            5. Delete Cart Items
            6. Delete Cart (optional)
            7. Return Created Order and Order Items
         */

        //BAD
        //create dictionary of type prices
        const ticket_type_prices = {}
        await TicketType.findAll({ attributes: ["type_id", "price"] })
            .then((ticket_types) =>
                ticket_types.forEach((ticket_type) => {
                    ticket_type_prices[ticket_type.type_id] = parseFloat(ticket_type.price)
                })
            )

        // ----- get user cart ----- 

        const userCart =
            await req.user.getCart({

                //Cart.findOne({
                include: {
                    model: CartItems,
                    include: {
                        model: TicketType,
                        attributes: ["name", "price", "description", "type_id"],
                    }
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            })

        // ----- Get cart items ----- 
        const cartItems = userCart.CartItems.map((current_item) => ({
            ticket_type_id: current_item.ticket_type_id,
            quantity: current_item.quantity,
        }))

        // ----- Extract Tickets ----- 

        // we need to do this because there can be a quantity of each ticket type
        let extracted_tickets = [], total = 0;
        cartItems.forEach((current_item) => {
            for (let tCount = 0; tCount < current_item.quantity; tCount++) {
                total += ticket_type_prices[current_item.ticket_type_id]
                extracted_tickets.push({
                    ticket_type_id: current_item.ticket_type_id
                })
            }
        })

        // placeholder tickets that will later be updated with a refernce number upon ticket number selection
        const created_tickets = await Ticket.bulkCreate(extracted_tickets)

        // ----- Create Order ----- 

        //build instead of create because theres missing required infromation, date (automatic) and subtotal
        const order = await Orders.create({ 
            user_id: req.user.user_id,
            total: total,               //from extracted tickets
            date: DateTime.now().toISO()
         })


        // ----- Create Order Items ----- 
        const order_items = created_tickets.map((current_ticket) => ({
            order_id: order.order_id,
            ticket_id: current_ticket.ticket_id
        }));

        await OrderItems.bulkCreate(order_items)

        // ----- Delete Cart Items ----- 
        //CartItems.destroy({ where: { cart_id: req.user.cart_id } })

        res.status(status.CREATED).json({
            message: "Order Created",
            ref: order.order_id,
        })

    }

}
export default CommerceControllers