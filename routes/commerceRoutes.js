"use strict";

import { Router } from "express";
import InfoController from "../controllers/infoControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.get("/cart", authenticate, CartControllers.getCart); //get all items in the cart
router.put("/cart", authenticate, CartControllers.addToCart); //add to cart
export default router;