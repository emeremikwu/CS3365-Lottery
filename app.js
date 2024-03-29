import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import env_config from './config/env_config.js';
import logger from './config/logger.js';
import { passport_config as passport } from './config/passport.js';
import { Defaults } from './config/defaults.js';
import { converter, notFound, handler } from './middlewares/error.js';
import routes from './routes/routes.js';
import cookie_tester from './utils/cookieTester.js';
import mariaDBTools from './config/maria_db.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', { extensions: ['html'] }));
app.use(passport.initialize());

// app.set("views", "./views");
// app.set("view engine", "pug")

// session and passport configuration
app.use(session(Defaults.session_config));
app.use(passport.session());
app.use(Defaults.request_logger());

app.use('/api', routes);
app.use(cookie_tester); // url: /cookie
app.use(converter);
app.use(notFound);
app.use(handler);

// await mariaDBTools.initializeNullTicketReferenceNumbers();
// await mariaDBTools.initializeDefaultTables(true, true);

app.listen(env_config.APP_PORT, () => {
	logger.info(`Server running on port ${env_config.APP_PORT}`);
});

export default app;
