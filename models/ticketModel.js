"use strict";
import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../config/maria_db.js";


class TicketModel extends Model {
    
}

TicketModel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },

    part1: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part2: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part3: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part4: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part5: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part6: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part7: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part8: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part9: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part10: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part11: {
        type: DataTypes.TINYINT.UNSIGNED,
    },
    part12: {
        type: DataTypes.TINYINT.UNSIGNED,
    },

}, {
    modelName: "tickets",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})

export { TicketModel as model }