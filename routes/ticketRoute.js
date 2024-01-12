// /api/ticket
// TODO:
import { Router } from 'express';
import { get_ValidateNumbers, patch_SelectNumbers } from '../validationSchemas/ticketSchemas.js';
import catchAsync from '../utils/catchAsync.js';
import validate from '../middlewares/validate.js';
import TicketController from '../controllers/ticketController.js';
import TicketMiddleware from '../middlewares/ticketMiddleware.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

// select numbers for a ticket
router.patch(
	'/select-numbers',
	authenticate(true),
	validate([patch_SelectNumbers]),
	catchAsync(TicketMiddleware.attachRequestedTickets_ID),
	catchAsync(TicketController.selectNumbers_ID),
);

// check if given numbers are valid
router.get(
	'/validate-numbers',
	validate([get_ValidateNumbers]),
	catchAsync(TicketMiddleware.attachTicketTypes),
	catchAsync(TicketController.validateNumbers),
);
export default router;
