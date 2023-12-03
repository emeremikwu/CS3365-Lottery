"use strict";

import express from 'express';
import session from "express-session"
import cors from 'cors';

import env_config from './config/env_config.js';
import logger from './config/logger.js';
import { passport_config as passport } from './config/passport.js';
import Defaults from './config/defaults.js';
import error_handler from "./middlewares/error.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(express.static('public'));

app.set("views", "./views");
app.set("view engine", "pug")


/* //session and passport configuration
app.use(session(Defaults.session_config));
app.use(passport.initialize());
app.use(Defaults.request_logger());


//app.use('/api/v1', routes);
app.use(Defaults.converter);
app.use(error.notFound);
app.use(error.handler); */

/* await Defaults.Models.setAssociations()
await Defaults.Models.initializeDefaultTables(true) */


app.listen(env_config.PORT, () => {
	logger.info(`Server running on port ${env_config.PORT}`);
})
export default app;
