/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/*
    contains functions for connecting and initializiing selected databse.
    database params and credentials should be set in environmentally using shell exports
 */

import env_config from './env_config.js';
import logger from './logger.js';
import { initializationOrder } from '../models/associations.js';

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
}
