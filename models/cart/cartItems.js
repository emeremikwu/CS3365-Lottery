import { DataTypes, Model } from 'sequelize';
import mariadb_connector from '../../config/maria_db.js';

class CartItem extends Model { }

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
    
    sequelize: mariadb_connector.sequelize,
    freezeTableName: true,
    timestamps: false,
    tableName: 'cart_items',

});

export { CartItem as model }