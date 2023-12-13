"use strict";

import { DataTypes, Model } from 'sequelize';
import mariadb_connector from '../../config/maria_db.js';

class Cart extends Model {}

Cart.init({

  // Foreign keys defined in associations.js
  // Foreign key: user_id (UserModel | user.js)

  cart_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

}, {

  sequelize: mariadb_connector.sequelize,
  tableName: 'cart',
  timestamps: true, //set true for users that aren't logged in, not implemented yet
  freezeTableName: true,

});

export { Cart as model }
