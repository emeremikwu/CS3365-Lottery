/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/*
    contains functions for connecting and initializiing selected databse.
    database params and credentials should be set in environmentally using shell exports
 */

import env_config from './env_config.js';
import logger from './logger.js';
import { Ticket, initializationOrder } from '../models/associations.js';
import { ticketIncludeClause } from '../models/includeClauses.js';
import sequelize from './sequelize.js';
import generateTicketReference from '../utils/ticket/generateReferenceNumber.js';

export default class mariaDBTools {
	// initializes sequelize class model
	static async initializeTables(models, destructive = false) {
		// first failsave
		if (env_config.isProduction()) {
			logger.warn('initializeTables is disabled in Production');
			return;
		}

		if (destructive) logger.warn('Executing destructive table queries');

		logger.debug('Starting DB sync');

		for (const model of models) {
			await model.sync({
				force: destructive,
				alter: true,
				// second failsafe
				match: /_dev$/,
			})
				.then(() => {
					logger.info(`\tAdded table '${model.tableName}'`);
				})
				.catch((err) => {
					logger.error('\tAn err has occured: \n', err);
				});
		}
		logger.debug('Sync Complete');
	}

	static async dropTables(localModels) {
		if (env_config.isProduction()) {
			logger.warn('dropTales is disabled in Production');
			return;
		}

		logger.debug('Dropping Table(s)');

		for (const model of localModels) {
			await model.drop().catch((err) => {
				logger.error(`\tError dropping table '${model.tableName}'\n`, err);
			});
		}

		const drop_list = localModels.map((model) => model.modelName);
		logger.info(`Dropped Table(s) ${drop_list}`);
	}

	static async initializeDefaultTables(destructive = false, alter = false) {
		if (env_config.isProduction()) {
			logger.warn('initializeTables is disabled in Production');
			return;
		}

		if (destructive) logger.warn('Executing destructive table queries');
		else logger.warn('Executing non-destructive table queries');

		for (const table of initializationOrder) {
			try {
				await table.sync({ force: destructive, alter });
				logger.info(`Table ${table.name} synchronized successfully`);
			} catch (error) {
				logger.error(`Error synchronizing table ${table.name}: ${error}`);
			}
		}

		logger.info('DB sync complete');
	}

	/*
		Initializes the ticket reference numbers of tickets that do not have one.

		This probably wont be called outside of development as the numbers are generated at
		the time of ticket creation. This is just a failsafe and a possible admin tool.
	 */
	static async initializeNullTicketReferenceNumbers() {
		logger.info('Initializing null ticket reference numbers');
		const nullReferenceTickets = await Ticket.findAll({
			where: { ticket_reference_number: null },
			...ticketIncludeClause,
		});

		if (!nullReferenceTickets.length) return;

		await sequelize.transaction(async (t) => {
			const ticketPromises = nullReferenceTickets.map(async (ticket) => {
				const ticket_reference_number = generateTicketReference(
					ticket.ticket_type_id,
					ticket.OrderItems[0].order_id,
					ticket.OrderItems[0].Order.date.toISOString(), // date object
					ticket.OrderItems[0].Order.user_id,
				);

				await ticket.update({ ticket_reference_number }, { transaction: t });
			});

			await Promise.all(ticketPromises);
		});
	}
}
