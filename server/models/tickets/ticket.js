import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class Ticket extends Model {}

Ticket.init({

	// Foreign keys defined in associations.js
	// Foreign keys: ticket_type_id (ticketType | ticketType.js),

	ticket_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
	},

	// visual identifier for user, will need a script to generate
	ticket_reference_number: {
		type: DataTypes.STRING,
		allowNull: true,
		unique: true,
	},

	// the selected numbers for the ticket separated by colons
	// e.g powerball "69:25:24:23:22:21"
	// allow null so a user can pick the numbers later
	selected_numbers: {
		type: DataTypes.STRING,
		allowNull: true,
	},

}, {

	tableName: 'tickets',
	freezeTableName: true,
	timestamps: true,
	sequelize,

});

export default Ticket;
