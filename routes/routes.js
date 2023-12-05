"use strict";

import { Router } from "express";
import authRoute from "./authRoute.js"
import infoRoute from "./infoRoute.js";


const routes = Router();

routes.use("/auth", authRoute);
routes.use("/info", infoRoute);

export default routes