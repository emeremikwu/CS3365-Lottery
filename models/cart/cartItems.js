import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class CartItem extends Model { }

CartItem.init({

	// Foreign key: cart_id ( Cart | cart.js)
	// Foreign key: ticket_type_id (TicketTypeModel | ticketType.js)

	cart_item_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
	},

	quantity: {
		type: DataTypes.INTEGER.UNSIGNED,
		defaultValue: 1,
	},

}, {

	freezeTableName: true,
	timestamps: false,
	tableName: 'cart_items',
	sequelize,

});

export default CartItem;
