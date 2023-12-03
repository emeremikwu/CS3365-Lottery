"use strict";

import { Router } from "express";
import { router as AuthRoute } from "./authRoute";

const router = Router();

router.use("/auth", AuthRoute);
