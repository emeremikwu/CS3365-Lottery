"use strict";

import { DataTypes, Model } from "sequelize";
import { model as OrderItems } from "./orderItems";

//basically a cart system 
OrderItems
export default class OrderModel extends Model {

}


OrderModel.init({
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
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

    // Foreign key: user_id (UserModel | user.js)

})


export { OrderModel as model }
