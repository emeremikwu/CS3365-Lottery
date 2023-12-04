"use strict";

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { model as UserAccounts } from '../models/userModel.js';

// Configure Passport.js to use the local strategy

const local_strategy = new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        //verify credentials

        await UserAccounts.findOne({ where: { email: email } })

            .then((user) => {
                //user not found
                if (!user) return done(null, false, { message: "User Not found" });

                //check if there is a non hashed password and compare
                if (password != user.password) return done(null, false, { message: "Bad Pasword" });
                return done(null, user);
            })

            .catch((err) => done(err));
    })

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        //user_id from userAccountModel
        cb(null, user.id)
    })
})

passport.deserializeUser(async (user_id, cb) => {
    process.nextTick(() => {
        console.log("deserializeUser")
        UserAccounts.findByPk(user_id)
            .then((user) => {
                if (!user) return cb(null, false);
                return cb(null, user);
            })

            .catch((err) => cb(err));
    })
})

passport.use(local_strategy)

export default passport;
export { passport as passport_config }

