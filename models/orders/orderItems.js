"use strict";

import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../../config/maria_db.js";

class OrderItemModel extends Model {
    
}

OrderItemModel.init({
    order_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    // Foreign key: order_id (OrderModel | order.js)
    // Foreign key: ticket_id (TicketModel | ticket.js)
    // Foreign key: ticket_type_id (TicketTypeModel | ticketType.js)
    // Foreign key: user_id (UserModel | user.js)
}, {
    modelName: "order_items",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})

export { OrderItemModel as model }