/* eslint-disable no-unused-vars */
import { Model, DataTypes } from 'sequelize';
import logger from '../../config/logger.js';
import sequelize from '../../config/sequelize.js';

// TODO:
/*
	[ ] - implement delimiter resolver
	[ ] = implement method that saves previous delimiters to a file
 */

export class TicketType extends Model {}

TicketType.init({
	type_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
	},

	// powerball, megamillions, etc
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},

	// the number of numbers to be selected
	number_count: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},

	// string of numbers seperated by colons denoting the maximum number of each number allowed
	// e.g powerball: "69:69:69:69:69:26"
	constraint: {
		type: DataTypes.STRING,
		allowNull: false,
		comment: 'string of numbers seperated by colons denoting the maximum number of each number allowed e.g powerball: "69:69:69:69:69:26"',
	},

	//  price ...
	price: {
		// a total of 10 diguts but only 2 after the decimal (-9999999.99 to 9999999.99)
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false,
	},

	description: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	// running total of tickets sold maximum of 1 quadrillion
	running_total: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
		defaultValue: 0,
		comment: 'Running total of tickets sold maximum of 1 quadrillion. (e.g user buys a ticket, total added to running total).',
	},

	// if the ticket type is disabled it will not be available for purchase
	disabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},

}, {
	hooks: {
		beforeCreate: (ticketType, options) => {
			const newTicketType = { ...ticketType };

			if (!newTicketType.disabled && newTicketType.price) {
				newTicketType.disabled = ticketType.price <= 0;
			}

			Object.assign(ticketType, newTicketType);
		},

		beforeUpdate: (ticket, options) => {
			if (ticket.running_total) {
				// eslint-disable-next-line no-param-reassign
				delete ticket.running_total;
				logger.warn(`Atempted to update running_total for ticket_type: '${ticket.name}'`);
			}
		},
	},

	tableName: 'ticket_types',
	freezeTableName: true,
	timestamps: true,
	sequelize,

});

export default TicketType;
