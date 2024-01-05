import { logger } from '../config/logger.js';
import { queryDate } from '../utils/sequelizeQueryGenerator.js';

// TODO:
export class OrderController {
	// returns a page count given the
	static async getPageCount(req, res) {
		const { pageSize = 10 } = req.query;
		const [sequelizedQueryObject, message] = queryDate(req.query);
		const orderCount = (await req.user.getOrders({ sequelizedQueryObject })).length;
		const pageCount = Math.ceil(orderCount / pageSize);

		res.json({
			pageCount,
			pageSize,
			...(message && { message: `time-range:'${message}'` }),

		});
	}

	/*
		Maps a user's order history to a more readable format
		Sends the mapped data to the user
		Order middleware that attaches the user's order history to req.user must be called first
		Appropriate associations must be included:
			OrderItem -> Ticket -> TicketType(see models/includeClauses.js)
	*/
	static async mapAndSend(req, res) {
		logger.info(`Mapping Order Data: UID-${req.user.user_id}`);
		// promise.all wouldn't make sense here because the operation is synchronous
		const orderHistory = req.user.orders.map((order) => ({
			order_number: order.order_id,
			date: order.date,
			subtotal: order.subtotal,

			tickets: order.OrderItems.map((orderItem) => ({
				id: orderItem.ticket_id,
				type_name: orderItem.Ticket.TicketType.name,
				type_id: orderItem.Ticket.ticket_type_id,
				constraint: orderItem.Ticket.TicketType.constraint,
				reference_number: orderItem.Ticket.ticket_reference_number, // will be null for now
				// if null, user hasn't picked numbers yet, propmt them to do so
				selected_numbers: orderItem.Ticket.selected_numbers,
			})),
		}));

		res.json({
			...(req.response_message && { messasge: req.response_message }),
			...(req.pageCount && { pageCount: req.pageCount }),
			...(req.page && { page: req.page }),
			order_history: orderHistory.length !== 1 ? orderHistory : orderHistory[0],
		});
	}
}

export default OrderController;
