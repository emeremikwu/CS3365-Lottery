"use strict";

import status from "http-status";

import {
    TicketType as TicketCatalog,
    WinningTicket as WinningTickets
} from "../models/associations.js";

export class CartController {
    static async getCart(req, res, next) {
        try {
            const cart = await req.user.getCart();
            res.status(status.OK).json(cart);
        } catch (error) {
            next(error);
        }
    }

}

export default CartController