import { Model, DataTypes } from 'sequelize';

import sequelize from '../../config/sequelize.js';
import { Order } from './order.js';
import { Ticket } from '../tickets/ticket.js';

export class OrderItem extends Model {}

OrderItem.init({

	// Foreign keys defined in associations.js
	// Foreign key: order_id (Orders | order.js)
	// Foreign key: ticket_id (Tickets | ticket.js)

	order_item_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
	},

	// fk, defined in associations, here for testing purposes
	order_id: {
		type: DataTypes.UUID,
		references: {
			model: Order,
		},
	},

	// fk, defined in associations, here for testing purposes
	ticket_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		references: {
			model: Ticket,
		},
	},

}, {
	tableName: 'order_items',
	freezeTableName: true,
	timestamps: false,
	// eslint-disable-next-line camelcase
	sequelize,
});

export default OrderItem;
