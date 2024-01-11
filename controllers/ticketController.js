import httpStatus from 'http-status';
import logger from '../config/logger.js';
import sequelize from '../config/sequelize.js';
import APIError from '../utils/errors/apiError.js';
import TicketDNEError from '../utils/errors/ticketDNEError.js';
import TicketInvalidNumbersError from '../utils/errors/ticketInvalidNumbersError.js';
import UnauthorizedError from '../utils/errors/unauthorizedError.js';
import { formatNumbers, validateParital, validateStrict } from '../utils/ticket/ticketNumberTools.js';
// api/ticket

// TODO:
export class TicketController {
	/*
		Updates the selected numbers for the given a list of tickets and their selected numbers
		Sends the updated ids to the user
		Middleware that attaches the requested tickets to req.requestedTickets must be called first
		Appropriate associations must be included:
			OrderItem -> Order, Ticket (see models/includeClauses.js | ticketIncludeClauses)
	*/

	static async selectNumbers_ID(req, res) {
		// [ ] - remove .toLowerCase() ... once validations are implemented
		const haultOnError = req.body.haultOnError
			|| (req.query.haultOnError && req.query.haultOnError.toLowerCase() === 'true')
			|| false;

		const { authorized, unauthorized, unknown } = req.requestedTickets;

		if (haultOnError) {
			if (unknown.length) {
				throw new TicketDNEError(`Unable to find ticket${unknown.length > 1 ? 's' : ''} "${unknown.toString()}"`);
			}

			if (unauthorized.length) {
				throw new UnauthorizedError(`User does not own ticket${unauthorized.length > 1 ? 's' : ''} ${unauthorized.toString()}`);
			}
		}

		const updatedTickets = [];
		// [ ] - switch ticket_id to ticket_reference_number once implemented
		await sequelize.transaction(async (t) => {
			/*
				'no-restricted-syntax' and 'no-await-in-loop' are unavoidable
				for whatever reason transactions do not work well with forEach or Promise.all(...map)
				https://stackoverflow.com/questions/61369310/sequelize-transactions-inside-foreach-issue
			*/

			const ticketPromises = authorized.map(async (ticket) => {
				const { constraint } = ticket.TicketType;
				const { ticket_id } = ticket;
				const selected_numbers = formatNumbers(req.body.tickets[ticket_id]);
				const result = validateStrict(selected_numbers, constraint);
				// if result is 0 and selected_numbers is not the same as the one in the db, save it
				// reduce db calls as much as possible

				if (!result && selected_numbers !== ticket.selected_numbers) {
					// eslint-no-param-reassign compliance
					const newTicketInfo = { selected_numbers };
					Object.assign(ticket, newTicketInfo);
					// eslint-disable-next-line no-await-in-loop
					await ticket.save({ fields: ['selected_numbers'], transaction: t });
					updatedTickets.push(ticket_id);
				} else if (haultOnError) {
					throw new TicketInvalidNumbersError(ticket_id, constraint, selected_numbers, result);
				}
			});

			await Promise.all(ticketPromises);
		});

		logger.debug(`Updated ${authorized.length} tickets, user_id: ${req.user.user_id}`);

		res.json({
			message: `Updated ${updatedTickets.length} ticket${updatedTickets.length > 1 ? 's' : ''}.`,
			updatedTickets,
		});
	}

	/*
		Validates the given numbers against the given constraints
		One ticket type per request
		e.g:
		{ "type_id", "selected_numbers" }
		or
		[
			{ "type_id", "selected_numbers" },
			{ "type_id", "selected_numbers" },
			{ "type_id", "selected_numbers" },
			...max 15
		]

		returns an array of booleans corresponding to the input numbers
	 */
	static async validateNumbers(req, res) {
		// { ticket_type, selected_numbers }
		// evaluate as array to avoid redundency
		const tickets = Array.isArray(req.body) ? req.body : [req.body];

		if (!req.ticketTypes) {
			throw new APIError(
				'TicketTypes not attached to request object prior to "validateNumbers", call "attachTicketTypes" or simlar middleware',
				httpStatus.INTERNAL_SERVER_ERROR,
				false,
			);
		}

		let status = httpStatus.OK;
		const responseArray = [];
		const max = Math.min(tickets.length, 10);

		for (let index = 0; index < max; index += 1) {
			const currentTicket = Object.entries(tickets[index]);
			const [type_id, selecte_numbers] = currentTicket[0];
			const ticketType = req.ticketTypes.find((tt) => tt.type_id === Number(type_id));

			if (!ticketType) {
				responseArray.push({});
				status = httpStatus.BAD_REQUEST;
			} else {
				const { constraint } = ticketType;
				const resultArray = validateParital(selecte_numbers, constraint);
				if (!resultArray.length || resultArray.includes(false)) status = httpStatus.BAD_REQUEST;
				responseArray.push({ [type_id]: resultArray });
			}
		}

		res.status(status).json(responseArray.length === 1 ? responseArray[0] : responseArray);
	}
}

export default TicketController;
