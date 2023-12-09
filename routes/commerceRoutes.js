"use strict";

import { Router } from "express";
//mport InfoController from "../controllers/infoControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import CommerceControllers from "../controllers/commerceControllers.js";
import CommerceMiddleware from "../middlewares/commerceMiddleware.js";
import catchAsync from "../utils/catchAsync.js"


const router = Router();

//ensure that the user has a cart, doesn't work with non-authenticated users atm
router.use(authenticate, catchAsync(CommerceMiddleware.cartInitializer)); 

//gets users cart
router.get("/cart", catchAsync(CommerceControllers.getCart));

//add to cart
router.post("/cart", catchAsync(CommerceControllers.addToCart));

//update or delete item based on quantity (0: delete)
router.patch("/cart", catchAsync(CommerceControllers.updateCartItemQuantity))

router.post("/cart/checkout", catchAsync(CommerceControllers.checkout)); 

export default router;