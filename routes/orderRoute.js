// api/shop/orders

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { OrderController } from '../controllers/orderController.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router();

// make sure the user is logged in
router.use(catchAsync(authenticate));

// returns all orders
router.get('/', catchAsync(OrderController.getAll));

// returns details about a specific order
// router.get("/order")

export default router;
