"use strict";

import status from "http-status";

import {
    Cart,
    CartItem,
    TicketType,
    Orders,
    OrderItems
} from "../models/associations.js";
import logger from "../config/logger.js";

export class CommerceControllers {

    static async getCart(req, res, next) {

        const user_cart = await req.user.getCart({
            include: {
                model: CartItem,    //model name is cart_items
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

        return res.json(cart_items);
    }

    //post
    static async addToCart(req, res, next) {
        const {
            ticket_type_id,
            quantity,
        } = req.body

        const [cart_item, created] = await CartItem.findOrCreate({
            where: {
                cart_id: req.user.cart_id, //we ensure that the user has a cart in the middleware 
                ticket_type_id: ticket_type_id
            }
        })

        if (created) {
            cart_item.quantity = quantity
            await cart_item.save()
        } else {
            cart_item.quantity += quantity
            await cart_item.save()
        }

        res.status(status.CREATED).json({
            status: status.CREATED,
            message: "Added to cart",
            cart_item,
        })
    }


    /* 
        PATCH method
        for now we'er assuming that either a cart_item or ticket_type id is proivded
        this will be validated later using validators and Joi

        this implementation because there can only be one type of each at a time
    */
    static async updateCartItemQuantity(req, res, next) {
        const {
            cart_item_id,
            ticket_type_id,
            quantity
        } = req.body

        const cart_item = await CartItem.findOne({
            where: {
                cart_id: req.user.cart_id,
                // might xor these in validations later
                ...(!!cart_item_id && { cart_item_id }),
                ...(!!ticket_type_id && { ticket_type_id }),
            }
        })

        if (!cart_item) {
            return res.status(status.NOT_FOUND).json({
                status: status.NOT_FOUND,
                message: "Cart item not found"
            })
        }

        //if quantity is equal to zero
        if (quantity) {
            cart_item.quantity = quantity
            await cart_item.save()
        } else {
            cart_item.destroy()
        }
        res.status(status.OK).json({
            status: status.OK,
            message: `Cart item ${quantity ? "updated" : "deleted"}`,
            cart_item,
        })
    }

}

export default CommerceControllers