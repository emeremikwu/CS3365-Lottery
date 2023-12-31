// /api
import { Router } from 'express';
import authRoute from './authRoute.js';
import infoRoute from './infoRoute.js';
import commerceRoute from './cartRoute.js';
import orderRoute from './orderRoute.js';
import ticketRoute from './ticketRoute.js';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/info', infoRoute);
routes.use('/shop', commerceRoute);
routes.use('/', orderRoute); // contains /orders and /order-details
routes.use('/ticket', ticketRoute);

export default routes;
