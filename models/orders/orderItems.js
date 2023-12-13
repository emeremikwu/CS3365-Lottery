"use strict";

import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../../config/maria_db.js";
import { model as Orders } from "./order.js";
import { model as Ticket } from "../tickets/ticket.js";

class OrderItem extends Model {

}

OrderItem.init({

    // Foreign keys defined in associations.js
    // Foreign key: order_id (OrderModel | order.js)
    // Foreign key: ticket_id (TicketModel | ticket.js)
    
    order_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    //fk, defined in associations, here for testing purposes
    order_id: {
        type: DataTypes.UUID,
        references: {
            model: Orders
        }
    },

    //fk, defined in associations, here for testing purposes
    ticket_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Ticket,
        }
    }

}, {
    tableName: "order_items",
    freezeTableName: true,
    timestamps: false,
    sequelize: mariadb_connector.sequelize
})

export { OrderItem as model }