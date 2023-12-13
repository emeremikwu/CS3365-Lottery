"use strict";

import { DataTypes, Model } from "sequelize";
import mariadb_connector from "../../config/maria_db.js";
import { model as Users } from "../user/users.js";

export default class Order extends Model {

}


Order.init({

    // Foreign keys defined in associations.js
    // Foreign key: user_id ( User | user.js )

    order_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    subtotal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
    },


}, {
    tableName: "orders",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})


export { Order as model }
