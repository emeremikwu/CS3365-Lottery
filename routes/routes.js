"use strict";

import { Router } from "express";

const routes = Router();

import authRoute from "./authRoute.js"


routes.use("/auth", authRoute);

export { routes };