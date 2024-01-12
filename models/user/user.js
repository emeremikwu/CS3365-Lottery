import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

export class User extends Model {
	static async findByEmail(email) {
		const user = await User.findOne({ where: { email } });
		return user;
	}

	fullUserID() {
		return this.getDataValue('user_id');
	}

	get user_id() {
		const user_id = this.getDataValue('user_id');
		if (typeof user_id === 'string') {
			return user_id.length > 5 ? `...${user_id.slice(-9)}` : user_id;
		}
		return user_id;
	}
}

User.init({
	user_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},

	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	username: {
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
