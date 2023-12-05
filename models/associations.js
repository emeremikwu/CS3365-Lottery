"use strict";

import { model as TicketType } from "./tickets/ticketType.js";
import { model as Ticket } from "./tickets/ticket.js";
import { model as WinningTicket } from "./tickets/winningTicket.js";
import { model as User } from "./users.js";
import { model as Orders } from "./orders/order.js";
import { model as OrderItems } from "./orders/orderItems.js";


User.hasMany(Orders, { foreignKey: 'UserID' });
Orders.belongsTo(User, { foreignKey: 'UserID' });

Orders.hasMany(OrderItems, { foreignKey: 'OrderID' });
OrderItems.belongsTo(Orders, { foreignKey: 'OrderID' });

TicketType.hasMany(Ticket, { foreignKey: 'TypeID' });
Ticket.belongsTo(TicketType, { foreignKey: 'TypeID' });

OrderItems.belongsTo(Ticket, { foreignKey: 'TicketID' });
Ticket.hasMany(OrderItems, { foreignKey: 'TicketID' });

Ticket.hasOne(WinningTicket, { foreignKey: 'TicketID' });
WinningTicket.belongsTo(Ticket, { foreignKey: 'TicketID' });

/* 
    initialization order is important
    ---------------------------------
    User, 
    Orders, 
    TicketType,
    Ticket, 
    OrderItems, 
    WinningTicket
        
 */


export {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems
}

export default {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems
}




/* // ticket tables associations
Ticket.hasOne(TicketType, { as: "ticket_type" }, { onDelete: "RESTRICT" });

WinningTicket.hasOne(Ticket)


//users and orders associations
Order.belongsTo(User, { as: "user" }, { onDelete: "RESTRICT" });
Order.hasMany(OrderItem, { as: "order_id" }, { onDelete: "RESTRICT" });

OrderItem.hasMany(Ticket, { as: "ticket" }, { onDelete: "RESTRICT" });
Order.belongsTo(User, { as: "user" }, { onDelete: "SET NULL" });
 */

/* 
    Sync orders :

    - ticket relations
    ticket_type
    ticket
    WinningTicket



*/