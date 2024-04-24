import { Sequelize } from 'sequelize';
import env_config from './env_config.js';
import logger from './logger.js';

const sequelize = new Sequelize(
	env_config.DB_NAME,
	env_config.DB_USER,
	env_config.DB_PASS,
	{
		host: env_config.DB_HOST,
		port: env_config.DB_PORT || 3306,
		dialect: env_config.DB_DIALECT || 'mariadb',
		logging: (msg) => logger.debug(msg),
		dialectOptions: {
			requestTimeout: 30000,
		},
	},
);

export async function check_connection() {
	logger.info(`Checking '${sequelize.getDialect()}' Connection: ${sequelize.config.host}`);
	try {
		await sequelize.authenticate();
		logger.info(`Connection established to ${env_config.DB_DIALECT} database`);
	} catch (err) {
		logger.error('Could not establish a connection: ');
		logger.error(err.stack);
	}
}

export async function disconnect() {
	return sequelize.close();
}

export default sequelize;
