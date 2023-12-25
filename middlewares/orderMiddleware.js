/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import { DateTime } from 'luxon';
import {
	Order, OrderItem, Ticket, TicketType,
} from '../models/associations.js';
import { sequelizeQuery_date } from '../utils/sequelizeQuery.js';
import OrderNotFoundError from '../utils/errors/orderNotFoundError.js';

// eager loading for sequelize
const include_clause = {
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
	// [x] - implement pagination

	static async retrieveAll(req, res, next) {
		const orders = await req.user.getOrders({
			...include_clause,
		});

		req.user.orders = orders;
		req.response_message = 'Order History - All';
		next();
	}

	/*
		returns details about a specific order
		order must belong to the user
	 */
	static async retrieveOrderById(req, res, next) {
		const orderID = req.query.orderID || req.body.orderID || req.params.orderID;

		const order = await req.user.getOrders({
			where: { order_id: orderID },
			...include_clause, // include order items and tickets
		});
		// if order length equals 0, then the order doesn't exist
		if (order.length === 0) throw new OrderNotFoundError(orderID);

		req.user.orders = order;
		req.response_message = `Order History - orderID:${orderID}`;
		next();
	}

	// retrieves a list of orders given a specific page and optional page size
	static async retrieveByPage(req, res, next) {
		// pagesize is also the limitl
		const { page = 1, pageSize = 10 } = req.query;
		// although pagesize is passed as a string, it is converted to a number here, js is weird.
		// parseInt anyways to be save and its good practice
		const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
		const [where_clause, range_message] = sequelizeQuery_date(req.query);

		const orders = await req.user.getOrders({
			offset,
			limit: parseInt(pageSize, 10),
			order: [['date', 'DESC']],
			...where_clause,
			...include_clause,
		});

		req.user.orders = orders;
		// req.pageCount = Math.ceil((await Order.count({ where: where_clause })) / pageSize);
		req.page = page;
		req.response_message = `Order History - page:${page}|index:${offset}|time-frame:'${range_message}'`;
		next();
	}
}

export default OrderMiddleware;
