"use strict";
import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../../config/maria_db.js";

class TicketModel extends Model {
    
}

TicketModel.init({
    ticket_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
    },

    //visual identifier for user, will need a script to generate
    ticket_number_ref: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // the selected numbers for the ticket separated by colons
    // e.g powerball "69:25:24:23:22:21"
    // allow null so a user can pick the numbers later
    selected_numbers: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    //  Foreign keys: type_id (ticketTypeModel | ticketType.js), 

}, {
    
    
    modelName: "tickets",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
})

export { TicketModel as model }