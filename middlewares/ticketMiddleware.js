import httpStatus from 'http-status';
import logger from '../config/logger.js';
import { Ticket, TicketType } from '../models/associations.js';
import { ticketIncludeClause } from '../models/includeClauses.js';
import { queryTicketIDs } from '../utils/sequelizeQueryGenerator.js';

// TODO:
class TicketMiddleware {
	/*
		Creates a 'requestedTickets' object on containing the following variables:
			raw - the unaltered queried objects from the ticket ids passed in the body
			authorized - raw object filtered with the authorized tickets
			unauthorized - raw object filerewd with the unauthorized ticket 'IDs ONLY'
			unknown - ids of tickets that weren't found
		Attaches the object to the request body
	 */
	// [ ] - switch to ticket refernce number once implemented
	// [ ] - implement reference number based search
	// [ ] - implement user accountless ticket search, if authorized, attach to body
	static async attachRequestedTickets_ID(req, res, next) {
		if (req.user == null) {
			// logger.debug('ticket update request - no user');
			const msg = 'Userless ticket update requests not yet implemented';
			logger.debug(msg);
			return res.status(httpStatus.NOT_IMPLEMENTED).json({
				message: msg.concat(' - please login and try again'),
			});
		}

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
		return next();
	}

	// [ ] - implement caching, unnecessary to be a middlware without it
	static async attachTicketTypes(req, res, next) {
		const ticketTypes = await TicketType.findAll();
		req.ticketTypes = ticketTypes;
		next();
	}
}

export default TicketMiddleware;
