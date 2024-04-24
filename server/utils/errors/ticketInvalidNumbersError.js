import httpStatus from 'http-status';
import APIError from './apiError.js';

class TicketInvalidNumbersError extends APIError {
	constructor(ticketReference, constraint, selectedNumbers, invalidIndex) {
		const message = `Invalid numbers selected for ticket ${ticketReference} \
( Constraint: ${constraint}, \
Given: ${selectedNumbers}, \
Invalid Index:${invalidIndex} )`;

		super(message, httpStatus.BAD_REQUEST, true, false);
	}
}

export default TicketInvalidNumbersError;
