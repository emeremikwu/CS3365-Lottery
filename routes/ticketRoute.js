// /api/ticket
// TODO:
import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';
import catchAsync from '../utils/catchAsync.js';
import { TicketMiddleware } from '../middlewares/ticketMiddleware.js';
import validate from '../middlewares/validate.js';
import { get_ValidateNumbers, patch_SelectNumbers } from '../validationSchemas/ticketSchemas.js';

const router = Router();

// select numbers for a ticket
router.patch(
	'/select-numbers',
	validate([patch_SelectNumbers]),
	catchAsync(TicketMiddleware.attachRequestedTickets_ID),
	catchAsync(TicketController.selectNumbers_ID),
);

// [ ] - implement
// check if given numbers are valid
router.get(
	'/validate-numbers',
	validate([get_ValidateNumbers]),
	catchAsync(TicketMiddleware.attachTicketTypes),
	catchAsync(TicketController.validateNumbers),
);
export default router;
