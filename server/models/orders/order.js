import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class Order extends Model {}

Order.init({

	// Foreign keys defined in associations.js
	// Foreign key: user_id ( User | user.js )

	order_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
	},

	date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},

	subtotal: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
		defaultValue: 0,
	},

}, {

	tableName: 'orders',
	freezeTableName: true,
	timestamps: false,
	paranoid: true, // refunded orders
	sequelize,

});

export default Order;
