import {
	Order, OrderItem, CartItem, Ticket, TicketType,
} from './associations.js';

// gets the tickets associated user
export const ticketIncludeClause = {
	include:
	[
		{
			model: OrderItem,
			attributes: ['order_id'],
			include: {
				model: Order,
				attributes: ['user_id'],
			},
		},

		{
			model: TicketType,
		},
	],

	// attributes: { exclude: ['createdAt', 'updatedAt'] },
};

export const cartIncludeClause = {
	include: {
		model: CartItem, // model name is cart_items
		include: {
			model: TicketType,
			attributes: ['name', 'price', 'description', 'type_id'],
		},
	},

	// attributes: { exclude: ['createdAt', 'updatedAt'] },
};

export const orderIncludeClause = {
	// order: [['date', 'DESC']],
	include: {
		model: OrderItem,
		include: {
			model: Ticket,
			include: {
				model: TicketType,
			},
		},
	},

	// this sets the ordering for Order and Ticket, the include order needs to be specified
	// so if we wanted to set the order for TicketType it would need to be nested simlar to below
	//		*[OrderItem, Ticket, TicketType, ...]
	order: [
		['date', 'DESC'],							// display order for Order
		[OrderItem, Ticket, 'ticket_id', 'DESC'],	// display order for Ticket
	],

};
