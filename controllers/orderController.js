import status from 'http-status';
import {
	OrderItem, Ticket, TicketType,
} from '../models/associations.js';
// TODO:
export class OrderController {
	static async getAll(req, res) {
		// [ ] - move this to middleware and implement caching,
		const orders = await req.user.getOrders({
			include: {
				model: OrderItem,
				include: {
					model: Ticket,
					include: {
						model: TicketType,
					},
				},
			},
		});

		const orderHistory = orders.map((order) => ({
			order_number: order.order_id,
			date: order.date,
			subtotal: order.subtotal,
			tickets: order.OrderItems.map((orderItem) => ({
				id: orderItem.ticket_id,
				type_name: orderItem.Ticket.TicketType.name,
				type_id: orderItem.Ticket.ticket_type_id,
				reference_number: orderItem.Ticket.ticket_reference_number, // will be null for now
				// if null, user hasn't picked numbers yet, propmt them to do so
				selected_numbers: orderItem.Ticket.selected_numbers,
			})),
		}));

		res.status(status.OK).json({
			message: 'Order History - All',
			order_history: orderHistory,
		});
	}
}

export default OrderController;
