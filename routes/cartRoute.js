import { Router } from 'express';
// mport InfoController from "../controllers/infoControllers.js";
import { authenticate } from '../middlewares/authenticate.js';
import { CartController } from '../controllers/cartController.js';
import { CartMiddleware } from '../middlewares/cartMiddleware.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router();

// ensure that the user has a cart, doesn't work with non-authenticated users atm
router.use(authenticate, catchAsync(CartMiddleware.initializeCart));

// gets users cart
router.get('/cart', catchAsync(CartMiddleware.filterAndAttachCart()), catchAsync(CartController.getCart));

// add to cart
router.post('/cart', catchAsync(CartController.addToCart));

// update or delete item based on quantity
router.patch('/cart', catchAsync(CartController.updateItemQuantity));

// checkout
router.post('/cart/checkout', catchAsync(CartMiddleware.filterAndAttachCart(true)), catchAsync(CartController.checkout));

export default router;
