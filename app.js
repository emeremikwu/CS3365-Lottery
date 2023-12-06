"use strict";

import express from 'express';
import session from "express-session"
import cors from 'cors';
import cookieParser from 'cookie-parser';

import env_config from './config/env_config.js';
import logger from './config/logger.js';
import { passport_config as passport } from './config/passport.js';
import Defaults from './config/defaults.js';
import error_handler from "./middlewares/error.js"
import routes  from './routes/routes.js';
import cookie_tester from './utils/cookie_tester.js';
import ModelAssociations from './models/associations.js';
import mariadb_connector from './config/maria_db.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.set("views", "./views");
// app.set("view engine", "pug")

//session and passport configuration
app.use(session(Defaults.session_config));
app.use(passport.initialize());
app.use(passport.session());
app.use(Defaults.request_logger());

app.use('/api', routes);
app.use(cookie_tester); //url: /cookie
app.use(error_handler.converter);
app.use(error_handler.notFound);
app.use(error_handler.handler);

//await Defaults.Models.initializeDefaultTables(true, true)

app.listen(env_config.APP_PORT, () => {
	logger.info(`Server running on port ${env_config.APP_PORT}`);
})

export default app;
