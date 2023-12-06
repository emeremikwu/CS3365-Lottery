"use strict";

import { DataTypes, Model } from 'sequelize';
import mariadb_connector from '../../config/maria_db.js';

class Cart extends Model {

}


Cart.init({

  cart_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  /* UserID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Users may not be logged in
    references: {
      model: User,
      key: 'UserID',
    },
  }, 

  SessionID: {
    type: DataTypes.STRING,
    allowNull: true, // Users may not be logged in
  }, */


}, {
  sequelize: mariadb_connector.sequelize,
  modelName: 'cart',
  timestamps: false,
  freezeTableName: true,
});

export { Cart as model }
