// /api/ticket
// TODO:
import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';
import catchAsync from '../utils/catchAsync.js';
import { TicketMiddleware } from '../middlewares/ticketMiddleware.js';

const router = Router();

router.patch('/select-numbers', catchAsync(TicketMiddleware.attachRequestedTickets_ID), catchAsync(TicketController.selectNumbers_ID));

// [ ] - implement
// eslint-disable-next-line max-len
// router.get("/validate-numbers", catchAsync(TicketMiddleware.attachRequestedTickets_ID), catchAsync(TicketController.validateNumbers_ID));
export default router;
