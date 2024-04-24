import httpStatus from 'http-status';
import APIError from './apiError.js';

class TicketDNEError extends APIError {
	constructor(message, status = httpStatus.BAD_REQUEST) {
		super(message || 'Ticket does not exist', status, true, false);
		this.name = this.constructor.name;
	}
}

export default TicketDNEError;
