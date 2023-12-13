"use strict";
import updatedModels from '../models/associations.js';
import env_config from './env_config.js';
import logger from './logger.js';
import _ from 'lodash';

/* import { model as TicketTable, model } from '../models/ticketModel.js';
import { model as WinningsTable } from '../models/winningTicketModel.js';
import { model as UserTable } from "../models/userModel.js" */
export class Defaults {

    static #session_config = {
        secret: env_config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: env_config.isProduction(),
            maxAge: env_config.SESSION_COOKIE_MAX_AGE,
            httpOnly: true,
            sameSite: 'strict'
        }
    }

    static #limiter_config = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        // store: ... , // Use an external store for consistency across multiple server instances.
    }

    static request_logger = (detail = "") => (req, res, next) => {

        let relevant_headers = _.pick(req, [
            /* "user-agent", 
            "x-forwarded-for", 
            "x-forwarded-proto", 
            "x-forwarded-host" */
            "body",
            "query",
            "params",
            "session",
            "user",
            "isAuthenticated",
            "cookiee"
        ])

        logger.http(`New Request: ${req.method} ${req.originalUrl} ${req.ip}`)

        Object.entries(relevant_headers).forEach(([key, value]) => {
            switch (key) {
                case "headers":
                    if (detail === "full") logger.http(`\tRequest {Headers}: ${JSON.stringify(value)}`)
                    break;
                case "isAuthenticated":
                    logger.http(`\tRequest Authenitcated: ${req.isAuthenticated()}`)
                    break;
                default:
                    if (Object.entries(value).length)
                        logger.http(`\tRequest ${key}: ${JSON.stringify(value)}`)
                    break;
            }
        })
        next()
    }

    static get session_config() {
        return Defaults.#session_config
    }

    static get limiter_config() {
        return Defaults.#limiter_config
    }



}

Defaults.Models = class {
    static async initializeTables(destructive = false, ...models) {

        if (env_config.isProduction()) {
            logger.warn("initializeTables is disabled in Production")
            return;
        }

        if (destructive) logger.warn("Executing destructive table queries")

        logger.debug("Starting DB sync");

        //logger.info(models)
        for (const model of models) {
            await model.sync({ force: destructive });
        }

        logger.info("DB sync complete");
    }

    static async initializeDefaultTables(destructive = false, alter = false) {

        if (env_config.isProduction()) {
            logger.warn("initializeTables is disabled in Production")
            return;
        }

        if (destructive) logger.warn("Executing destructive table queries")
        else logger.warn("Executing non-destructive table queries")

        for (const table of updatedModels.initializationOrder) {
            try {
                await table.sync({ force: destructive, alter: alter });
                logger.info(`Table ${table.name} synchronized successfully`);
            } catch (error) {
                logger.error(`Error synchronizing table ${table.name}: ${error}`);
            }
        }
        
        logger.info("DB sync complete");

    }

    /*     static async setAssociations() {        
            UserTable.hasMany(TicketTable, { foreignKey: "user_id" })
            WinningsTable.belongsTo(TicketTable, { foreignKey: "winning_ticket_id" })
            WinningsTable.belongsTo(UserTable, { foreignKey: "user_id" })
        } */

}

export default Defaults;

