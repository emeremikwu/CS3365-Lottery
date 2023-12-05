"use strict";

import {
    TicketType as TicketCatalog,
    WinningTicket as WinningTickets
} from "../models/associations.js";



export class InfoController {
    static async getCatalog(req, res) {
        const catalog = await TicketCatalog.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt', "type_id"] }
        })

        res.json(catalog)
    }

    static async getWinnings(req, res) {
        const winning_tickets = await WinningTickets.findAll({
            attributes: { exclude: ["TicketID", 'updatedAt'] }
        })

        res.json(winning_tickets)
    }
}

export default InfoController