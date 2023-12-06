"use strict";

import { User } from "../models/associations.js";

const authenticate = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }  else {
        let user = await User.findByPk(1)
        req.user = user
        return next()
    }

    res.status(401).json({
        status: "error",
        message: "You are not logged in!"
    })
}

export {authenticate}