import httpStatus from 'http-status';
import APIError from './apiError.js';

class OrderNotFoundError extends APIError {
	constructor(order_id, message, status = httpStatus.NOT_FOUND) {
		super(message || `Could not find order on account - orderID:${order_id}`, status);
	}
}

export default OrderNotFoundError;
