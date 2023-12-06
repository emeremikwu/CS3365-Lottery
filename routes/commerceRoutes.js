"use strict";

import { Router } from "express";
//mport InfoController from "../controllers/infoControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import CommerceControllers from "../controllers/commerceControllers.js";


const router = Router();

router.get("/cart", authenticate, CommerceControllers.getCart); //get all items in the cart
router.put("/cart", authenticate, CommerceControllers.addToCart); //add to cart

export default router;