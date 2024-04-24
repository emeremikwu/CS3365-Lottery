import httpStatus from 'http-status';
import { Ticket } from '../models/associations.js';
import APIError from './errors/apiError.js';

/*
	Returns a formatted ticket objects given
	a Ticket object with the associations OrderItem and Order.

	(see ticketIncludeClause from 'models/includeClauses.js')
 */
function formatTicket(ticket) {
	if (!ticket || !Object.entries(ticket).length) {
		const errMsg = `Expected object '${Ticket.name}' got null or empty ticket instead`;
		throw new APIError(errMsg, httpStatus.INTERNAL_SERVER_ERROR, false);
	}

	return {
		user_id: ticket.OrderItems[0].Order.user_id,
		selected_numbers: ticket.selected_numbers,
		ticket_id: ticket.ticket_id,
		ticket_reference_number: ticket.ticket_reference_number,
	};
}

export default formatTicket;
