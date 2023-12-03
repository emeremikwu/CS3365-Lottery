"use strict";

import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../config/maria_db.js";


class WinningTicketModel extends Model {

}

//just contains the id, foreign keys will be set Defaults.ModelAssociations in config file in config folder
WinningTicketModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

}, {
    modelName: "winning_tickets",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})

export { WinningTicketModel as model }