import httpStatus from 'http-status';
import { queryDate } from '../utils/sequelizeQueryGenerator.js';
import OrderNotFoundError from '../utils/errors/orderNotFoundError.js';
import { orderIncludeClause } from '../models/includeClauses.js';
import { Order } from '../models/associations.js';
import APIError from '../utils/errors/apiError.js';

// eager loading for sequelize

// TODO:
class OrderMiddleware {
	// attached the user orders to the request object (req.user)
	// Eagerely loads the order items and tickets and ticket types
	// [ ] - implement caching
	// [x] - implement pagination

	static async retrieveAll(req, res, next) {
		const orders = await req.user.getOrders({ ...orderIncludeClause });
		req.user.orders = orders;
		req.response_message = 'Order History - All';
		next();
	}

	/*
		Attached the order to the request object (req.user)
		order must belong to the user
	 */
	static async retrieveOrderById(req, res, next) {
		const orderID = req.query.orderID || req.body.orderID || req.params.orderID;

		const order = await Order.findOne({
			where: { order_id: orderID },
			...orderIncludeClause, // include order items and tickets
		});
		// if order length equals 0, then the order doesn't exist
		if (order.length === 0) throw new OrderNotFoundError(orderID);
		/*
			if the order belongs to a user and:
				- the user is not logged in or
				- the order doesn't belong to the user
		 */
		if (order.user_id && (!req.user || order.user_id !== req.user.user_id)) {
			const msg = req.user ? 'Order does not belong to user' : 'This order is associated with an account, please login';
			const status = req.user ? httpStatus.FORBIDDEN : httpStatus.UNAUTHORIZED;
			throw new APIError(msg, status);
		}

		req.user.orders = [order]; // mapAndSend expects an array of orders
		req.response_message = `Order History - orderID:${orderID}`;
		next();
	}

	/*
		retrieves and attaches a list of orders given a page
		other optional query filters include:
			- pageSize (default is 10)
			- year
			- month
			- last (followed by a value of the number of days, default is 90)

	 */
	static async retrieveByPage(req, res, next) {
		// pagesize is also the limitl
		const { page = 1, pageSize = 10 } = req.query;
		// although pagesize is passed as a string, it is converted to a number here, js is weird.
		// convert using 'Number' anyways to be safe and its good practice
		const offset = (Number(page) - 1) * Number(pageSize);
		const [whereClause, rangeMessage] = queryDate(req.query);

		const orders = await req.user.getOrders({
			offset,
			limit: Number(pageSize), // needs to be a number
			...whereClause,
			...orderIncludeClause,
		});

		req.user.orders = orders;
		// req.pageCount = Math.ceil((await Order.count({ where: where_clause })) / pageSize);
		req.page = page;
		req.response_message = `Order History - page:${page}|index:${offset}|time-frame:'${rangeMessage}'`;
		next();
	}
}

export default OrderMiddleware;
