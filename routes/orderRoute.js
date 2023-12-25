// api/shop/orders

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { OrderController } from '../controllers/orderController.js';
import catchAsync from '../utils/catchAsync.js';
import { OrderMiddleware } from '../middlewares/orderMiddleware.js';

const router = Router();

// make sure the user is logged in
router.use(catchAsync(authenticate));

// query based, orders based on the page and page size (page, pageSize)
router.get('/orders', catchAsync(OrderMiddleware.retrieveByPage), catchAsync(OrderController.mapAndSend));

// router.get('/', catchAsync(OrderController.mapAndSend));
router.get('/orders/pages', catchAsync(OrderController.getPageCount));

// returns details about a specific order
router.get(['/order-details', '/order-details/:orderID'], catchAsync(OrderMiddleware.retrieveOrderById), catchAsync(OrderController.mapAndSend));

export default router;
