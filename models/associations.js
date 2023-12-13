"use strict";

/* 
    - Should probably set tableName attribute instead of model name in all of the following model classes
 */

import { model as TicketType } from "./tickets/ticketType.js";
import { model as Ticket } from "./tickets/ticket.js";
import { model as WinningTicket } from "./tickets/winningTicket.js";
import { model as User } from "./user/users.js";
import { model as Orders } from "./orders/order.js";
import { model as OrderItems } from "./orders/orderItems.js";
import { model as Cart } from "./cart/cart.js";
import { model as CartItems } from "./cart/cartItems.js";

// ------ fk creation in Orders ------
User.hasMany(Orders, { foreignKey: 'user_id' });
Orders.belongsTo(User, { foreignKey: 'user_id' });

//  ------ fk creation in OrderItems ------
Orders.hasMany(OrderItems, { foreignKey: 'order_id' },);
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

OrderItems.belongsTo(Ticket, { foreignKey: 'ticket_id', onDelete: "SET NULL", onUpdate: "CASCADE" });
Ticket.hasMany(OrderItems, { foreignKey: 'ticket_id', onDelete: "SET NULL", onUpdate: "CASCADE" });

// ------ fk creation in Ticket ------
TicketType.hasMany(Ticket, { foreignKey: 'ticket_type_id' });
Ticket.belongsTo(TicketType, { foreignKey: 'ticket_type_id' });

// ------ fk creation in WinningTicket ------
Ticket.hasOne(WinningTicket, { foreignKey: 'ticket_id' });
WinningTicket.belongsTo(Ticket, { foreignKey: 'ticket_id' });

// ------ fk creation in Cart ------
User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// ------ fk creation in CartItems ------
Cart.hasMany(CartItems, { foreignKey: 'cart_id' });
CartItems.belongsTo(Cart, { foreignKey: 'cart_id' });

CartItems.belongsTo(TicketType, { foreignKey: 'ticket_type_id' });
TicketType.hasMany(CartItems, { foreignKey: 'ticket_type_id' });



/* 
    initialization order is important
    ---------------------------------
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
export const initializationOrder = [
    User,
    TicketType,
    Ticket,
    WinningTicket,
    Orders,
    OrderItems,
    Cart,
    CartItems,
]


export default {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems,
    Cart,
    CartItems,
    initializationOrder
};


export {
    TicketType,
    Ticket,
    WinningTicket,
    User,
    Orders,
    OrderItems,
    Cart,
    CartItems
}