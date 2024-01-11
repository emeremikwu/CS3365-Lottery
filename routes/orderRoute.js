// api/shop/

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { OrderController } from '../controllers/orderController.js';
import catchAsync from '../utils/catchAsync.js';
import { OrderMiddleware } from '../middlewares/orderMiddleware.js';
import { getPage, getPageCount, getOrderDetails } from '../validationSchemas/orderSchemas.js';
import validate from '../middlewares/validate.js';

const router = Router();

// make sure the user is logged in
router.use(catchAsync(authenticate));

// query based, orders based on the page and page size (page, pageSize)
router.get(
	'/orders',
	validate([getPage]),
	catchAsync(OrderMiddleware.retrieveByPage),
	catchAsync(OrderController.mapAndSend),
);

// router.get('/', catchAsync(OrderController.mapAndSend));
router.get('/orders/page-count', validate([getPageCount]), catchAsync(OrderController.getPageCount));

// returns details about a specific order
router.get(
	['/order-details', '/order-details/:orderID'],
	validate([getOrderDetails]),
	catchAsync(OrderMiddleware.retrieveOrderById),
	catchAsync(OrderController.mapAndSend),
);

export default router;
