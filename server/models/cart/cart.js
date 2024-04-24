import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class Cart extends Model {}

Cart.init({

	// Foreign keys defined in associations.js
	// Foreign key: user_id (UserModel | user.js)

	cart_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
	},

}, {

	tableName: 'cart',
	timestamps: true, // set true for users that aren't logged in, not implemented yet
	freezeTableName: true,
	sequelize,

});

export default Cart;
