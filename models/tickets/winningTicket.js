"use strict";

import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../../config/maria_db.js";
class WinningTicketModel extends Model {

}

//just contains the id, foreign keys will be set Defaults.ModelAssociations in config file in config folder
WinningTicketModel.init({
    winningTicket_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    reward_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },

    selected_numbers: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // foreign keys: ticket_id (TicketModel | ticket.js)
    // foreign keys: ticket_type_id (TicketTypeModel | ticketType.js)

}, {
    modelName: "winning_tickets",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})

export { WinningTicketModel as model }