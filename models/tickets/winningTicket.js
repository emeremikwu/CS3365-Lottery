import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class WinningTicket extends Model {}

WinningTicket.init({

	// foreign keys: ticket_id (TicketModel | ticket.js)
	// foreign keys: ticket_type_id (TicketTypeModel | ticketType.js)

	winningTicket_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
	},

	reward_amount: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
	},

	selected_numbers: {
		type: DataTypes.STRING,
		allowNull: true,
	},

}, {

	tableName: 'winning_tickets',
	freezeTableName: true,
	timestamps: true,
	sequelize,

});

export default WinningTicket;
