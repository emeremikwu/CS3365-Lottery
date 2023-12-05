"use strict";

import { Router } from "express";
import InfoController from "../controllers/infoControllers.js";

const router = Router();

router.get("/catalog", InfoController.getCatalog);
router.get("/winnings", InfoController.getWinnings);
export default router;