/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import {
	Order, OrderItem, Ticket, TicketType,
} from '../models/associations.js';

const EagerLoadFormat = {
	include: {
		model: OrderItem,
		include: {
			model: Ticket,
			include: {
				model: TicketType,
			},
		},
	},
};

// TODO:
export class OrderMiddleware {
	// attached the user orders to the request object (req.user)
	// Eagerely loads the order items and tickets and ticket types
	// [ ] - implement caching
	// [ ] - implement pagination

	static async retrieveAll(req, res, next) {
		const orders = await req.user.getOrders({
			...EagerLoadFormat,
		});

		req.user.orders = orders;
		next();
	}

	static async retrieveOrderById(req, res, next) {
		const { orderID } = req.query;

		const order = await req.user.getOrders({
			where: {
				order_id: orderID,
			},
			...EagerLoadFormat,
		});

		req.user.orders = order;
		req.response_message = `Order History - orderID:${orderID}`;
		next();
	}

	// retrieves a list of orders given a specific page and optional page size
	static async retrieveByPage(req, res, next) {
		// pagesize is also the limit
		const { page = 1, pageSize = 10 } = req.query;
		const offset = (page - 1) * 10;

		const orders = await Order.findAll({	// req.user.getOrders({
			offset,
			limit: pageSize,
			...EagerLoadFormat,
		});

		req.user.orders = orders;
		req.response_message = `Order History - index:${offset} | page${page}`;
		next();
	}
}

export default OrderMiddleware;
