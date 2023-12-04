"use strict";

const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }   
    
    /* res.status(401).json({
        status: "error",
        message: "You are not logged in!"
    }); */

    res.redirect('/foo/bar')

}

export {authenticate/*  */}