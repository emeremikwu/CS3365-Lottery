import { TicketType } from './tickets/ticketType.js';
import { Ticket } from './tickets/ticket.js';
import { WinningTicket } from './tickets/winningTicket.js';
import { User } from './user/user.js';
import { Order } from './orders/order.js';
import { OrderItem } from './orders/orderItems.js';
import { Cart } from './cart/cart.js';
import { CartItem } from './cart/cartItems.js';

let associationsAlreadySet = false;
function setAssociations() { // ------ fk creation in Orders ------
	if (associationsAlreadySet) return;
	associationsAlreadySet = true;

	User.hasMany(Order, { foreignKey: 'user_id' });
	Order.belongsTo(User, { foreignKey: 'user_id' });

	//  ------ fk creation in OrderItems ------
	Order.hasMany(OrderItem, { foreignKey: 'order_id' });
	OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

	OrderItem.belongsTo(Ticket, { foreignKey: 'ticket_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
	Ticket.hasMany(OrderItem, { foreignKey: 'ticket_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

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
	Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
	CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

	CartItem.belongsTo(TicketType, { foreignKey: 'ticket_type_id' });
	TicketType.hasMany(CartItem, { foreignKey: 'ticket_type_id' });
}

setAssociations();

const initializationOrder = [
	User,
	TicketType,
	Ticket,
	WinningTicket,
	Order,
	OrderItem,
	Cart,
	CartItem,
];

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

export {
	TicketType,
	Ticket,
	WinningTicket,
	User,
	Order,
	OrderItem,
	Cart,
	CartItem,
	setAssociations,
	initializationOrder,
};
