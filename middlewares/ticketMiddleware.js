import { logger } from '../config/logger.js';
import { Ticket } from '../models/associations.js';
import { ticketIncludeClause } from '../models/includeClauses.js';
import { queryTicketIDs } from '../utils/sequelizeQueryGenerator.js';

// TODO:
export class TicketMiddleware {
	/*
		Creates a 'requestedTickets' object on containing the following variables:
			raw - the unaltered queried objects from the ticket ids passed in the body
			authorized - raw object filtered with the authorized tickets
			unauthorized - raw object filerewd with the unauthorized ticket 'IDs ONLY'
			unknown - ids of tickets that weren't found
		Attaches the object to the request body
	 */
	// [ ] - switch to ticket refernce number once implemented
	static async attachRequestedTickets_ID(req, res, next) {
		logger.debug('ticket update request');
		const { tickets } = req.body;
		// Parse ticket IDs to integers
		const bodyTickets = Array.from(Object.keys(tickets), (ticketID) => Number(ticketID));
		// better equalevalent, above method is an understanding check
		// const bodyTicketsArray = Object.keys(bodyTickets).map((ticketID) => Number(ticketID));

		// Db query the requested tickets
		const requestedTickets = await Ticket.findAll({
			// pass bodyTicketsArray instead of body to avoid redundent operations
			...queryTicketIDs(null, bodyTickets)[0],
			...ticketIncludeClause,
		});

		// Filter unknown tickets
		const unknown = bodyTickets.filter(
			(ticketID) => !requestedTickets.some((ticket) => ticket.ticket_id === ticketID),
		);

		// Separate authorized and unauthorized tickets
		const authorized = [];
		const unauthorized = [];
		requestedTickets.forEach((ticket) => {
			if (ticket.OrderItems[0].Order.user_id === req.user.user_id) {
				authorized.push(ticket); // push entire object
			} else {
				unauthorized.push(ticket.ticket_id); // push id only
			}
		});

		// Attach to body
		req.requestedTickets = {};
		Object.assign(req.requestedTickets, {
			raw: requestedTickets, 	// incase we need it later
			authorized,
			unauthorized,
			unknown,
		});

		logger.debug(`Authorized: ${authorized.length}, Unauthorized: ${unauthorized.length}, Unknown: ${unknown.length} - attached to request body`);
		next();
	}
}

export default TicketMiddleware;
