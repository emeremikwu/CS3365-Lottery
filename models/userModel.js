"use strict";

import { Model, DataTypes } from "sequelize";
import mariadb_connector from "../config/maria_db.js";


class UserModel extends Model {
    static async findByEmail(email) {
        return await UserModel.findOne({ where: { email: email } })
    }
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    address2: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    zip: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    modelName: "users",
    freezeTableName: true,
    timestamps: true,
    sequelize: mariadb_connector.sequelize
}) 

export { UserModel as model }