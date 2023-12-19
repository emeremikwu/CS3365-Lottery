import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class User extends Model {
	static async findByEmail(email) {
		const user = await User.findOne({ where: { email } });
		return user;
	}
}

User.init({
	user_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		comment: 'change to uuid before production',
	},

	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	first_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	last_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	address: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	address2: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	city: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	state: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	zip: {
		type: DataTypes.STRING,
		allowNull: true,
	},

}, {

	tableName: 'users',
	freezeTableName: true,
	timestamps: true,
	sequelize,

});

export default User;
