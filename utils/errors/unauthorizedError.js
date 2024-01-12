import httpStatus from 'http-status';
import APIError from './apiError.js';

class UnauthorizedError extends APIError {
	constructor(message = null, url = null) {
		const localmessage = `Unauthorized$${url ? ` ${toString(url)}` : ''}`;
		super(message || localmessage, httpStatus.UNAUTHORIZED, true);
	}
}

export default UnauthorizedError;
