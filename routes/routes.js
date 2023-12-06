"use strict";

import { Router } from "express";
import authRoute from "./authRoute.js"
import infoRoute from "./infoRoute.js";
import commerceRoutes from "./commerceRoutes.js";


const routes = Router();

routes.use("/auth", authRoute);
routes.use("/info", infoRoute);
routes.use(commerceRoutes)

export default routes