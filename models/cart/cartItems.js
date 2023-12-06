import { DataTypes, Model } from 'sequelize';
import mariadb_connector from '../../config/maria_db.js';

class CartItem extends Model { }

CartItem.init({

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
    sequelize: mariadb_connector.sequelize,
    freezeTableName: true,
    timestamps: false,
    modelName: 'cart_items',

});

export { CartItem as model }