import { logger } from '../config/logger.js';
import sequelize from '../config/sequelize.js';
import TicketDNEError from '../utils/errors/ticketDNEError.js';
import TicketInvalidNumbersError from '../utils/errors/ticketInvalidNumbersError.js';
import UnauthorizedError from '../utils/errors/unauthorizedError.js';
import validateSelectedNumbers from '../utils/ticket/validateSelectedNumbers.js';
// api/ticket

// TODO:
export class TicketController {
	// will be depricated(but like actually)
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

			// eslint-disable-next-line no-restricted-syntax,
			for (const ticket of authorized) {
				const { constraint } = ticket.TicketType;
				const { ticket_id } = ticket;
				const selected_numbers = req.body.tickets[ticket_id];

				const result = validateSelectedNumbers(selected_numbers, constraint);

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
			}
		});

		logger.debug(`Updated ${authorized.length} tickets, user_id: ${req.user.user_id}`);

		res.json({
			message: `Updated ${updatedTickets.length} ticket${updatedTickets.length > 1 ? 's' : ''}.`,
			updatedTickets,
		});
	}
}

export default TicketController;
