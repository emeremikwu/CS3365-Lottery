"use strict";

import { model as TicketType } from "./tickets/ticketType.js";
import { model as Ticket } from "./tickets/ticket.js";
import { model as WinningTicket } from "./tickets/winningTicket.js";
import { model as User } from "./user/users.js";
import { model as Orders } from "./orders/order.js";
import { model as OrderItems } from "./orders/orderItems.js";
import { model as Cart } from "./cart/cart.js";
import { model as CartItem } from "./cart/cartItems.js";

User.hasMany(Orders, { foreignKey: 'user_id' });
Orders.belongsTo(User, { foreignKey: 'user_id' });

Orders.hasMany(OrderItems, { foreignKey: 'order_id' });
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

TicketType.hasMany(Ticket, { foreignKey: 'type_id' });
Ticket.belongsTo(TicketType, { foreignKey: 'type_id' });

OrderItems.belongsTo(Ticket, { foreignKey: 'ticket_id' });
Ticket.hasMany(OrderItems, { foreignKey: 'ticket_id' });

Ticket.hasOne(WinningTicket, { foreignKey: 'ticket_id' });
WinningTicket.belongsTo(Ticket, { foreignKey: 'ticket_id' });

User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

CartItem.belongsTo(TicketType, { foreignKey: 'ticket_type_id' });
TicketType.hasMany(CartItem, { foreignKey: 'ticket_type_id' });

/* 
    initialization order is important
    ---------------------------------
    User, 
    Orders, 
    TicketType,
    Ticket, 
    OrderItems, 
    WinningTicket


    New Order:
    Users
    TicketType
    Ticket
    Cart
    CartItem
    Order
    OrderItems
    WinningTickets
        
 */


export {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems,
    Cart,
    CartItem
}

export default {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems,
    Cart,
    CartItem
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