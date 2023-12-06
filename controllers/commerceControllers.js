"use strict";

import status from "http-status";

import {
    Cart,
    CartItem,
    TicketType,
    Orders,
    OrderItems
} from "../models/associations.js";

export class CommerceControllers {

    static async getCart(req, res, next) {
        const user_cart =/*  
        
        await Cart.findOne({
            where: {
                user_id: req.user.user_id,
            },
            include:
            {
                model: CartItem,
                attributes: { exclude: ["cart_item_id"] },
            },
        }) */

            await Cart.findOne({
                where: { user_id: req.user.id },
                include: {
                    model: CartItem,
                    include: {
                        model: TicketType,
                        through: { attributes: [] }
                    },
                },
                attributes: { exclude: ["cart_item_id", "createdAt", "updatedAt"] },


            })

        return res.json(user_cart)
    }

    static async addToCart(req, res, next) {
        const {
            ticket_type_id,
            quantity
        } = req.body

        const [user_cart, created] = await Cart.findOrCreate({
            where: {
                user_id: req.user.id
            },
            include: {
                model: CartItem,
                include: {
                    model: TicketType
                }
            }
        })

        if (created) {
            return res.status(status.OK).json(user_cart)
        }

        const [cart_item, cart_item_created] = await CartItem.findOrCreate({
            where: {
                cart_id: user_cart.id,
                ticket_type_id: ticket_type_id
            }
        })

        if (cart_item_created) {
            cart_item.quantity = quantity
            await cart_item.save()
        } else {
            cart_item.quantity += quantity
            await cart_item.save()
        }

        return res.status(status.OK).json(user_cart)
    }

}

export default CommerceControllers