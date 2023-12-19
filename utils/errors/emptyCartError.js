import httpStatus from 'http-status';
import APIError from './apiError.js';

class EmptyCartError extends APIError {
	constructor(message) {
		super(message || 'Cannot Proceed with checkout. Your cart is empty', httpStatus.BAD_REQUEST, true);
		this.name = this.constructor.name;
	}
}

export default EmptyCartError;
