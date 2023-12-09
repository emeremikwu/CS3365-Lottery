"use strict";

import logger from "../config/logger.js";
// TODO: add functionality for users who are not logged in

import { Cart } from "../models/associations.js";

export class CommerceMiddleware {


    // ensure that the user has a cart

    /* TODO: 
        we can lighten the load by sending and storing the cart_id in the 
            session instead of querying the database every time the user makes a request
            this will be a todo for later
    */

    // request based
    // static async cartInitializer(req, res, next) {
    //     if (!req.user.cart_id) {
    //         const [user_cart, created] = await Cart.findOrCreate({
    //             where: {
    //                 user_id: req.user.user_id
    //             }
    //         })

    //         if (created) {
    //             logger.info(`Created cart for user ${req.user.user_id}`)
    //         }

    //         req.user.cart_id = user_cart.cart_id
    //     }

    //     next()
    // }

    // session based 
    // will prevent the need to query the database every time the user makes a request
    // wont make a difference if we usse db based sessions
    static async cartInitializer(req, res, next) {


        if (!req.user.cart_id) {

            if (!req.session.cart_id) {
                const [user_cart, created] = await Cart.findOrCreate({
                    where: {
                        user_id: req.user.user_id
                    }
                })

                if (created) {
                    logger.info(`Created cart for user ${req.user.user_id}`)
                }

                req.session.cart_id = user_cart.cart_id
            }

            req.user.cart_id = req.session.cart_id
        }

        next()
    }

}

export default CommerceMiddleware