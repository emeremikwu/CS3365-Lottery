"use strict";

import APIError from "../utils/apiError.js";
import httpStatus from "http-status"
import { passport_config as passport } from "../config/passport.js";

import logger from "../config/logger.js";
import { User as Users } from "../models/associations.js";

// since we're pasing verifyCallback to authenticate, the UserAccountModel object isn't automatically added to the request as user(req.user)
// so we have to assign it ourselves

export class AuthController {
	
	static signup = async (req, res) => {
		const user = Users.create(req.body)
		logger.info(`Created user ${user.id} | ${user.first_name}`)
		return res.status(httpStatus.CREATED).json({
			success: true,
			data: user
		});
	};


	static verifyCallback = (req, resolve, reject) => async (err, user, info) => {
		if (err || info || !user) {
			return reject(new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED));
		}

		req.login(user, err => reject(err));
		//req.user = user; //not needed since were calling login, jwt would need this

		//logger.info(`User logged in:  ${user.id}-${user.first_name}`)
		return document()
		return resolve();
	};

	static signin = async (req, res, next) => {
		return new Promise((resolve, reject) => {
			passport.authenticate(
				"local",
				{ failureRedirect: "/index.html" },
				AuthController.verifyCallback(req, resolve, reject, next)
			)(req, res, next);
		}).then(() => {
			logger.info(`User logged in: ${req.user.id}-${req.user.first_name}`)
			res.redirect("/profile.html")
		}).catch;
	};

	//returns partial information about the user
	static current = async (req, res) => {
		const user = await Users.findByPk(req.user.id);
		if (!user) {
			throw new APIError('User not found', httpStatus.NOT_FOUND);
		}

		return res.json({
			success: true,
			data: {
				first_name: user.first_name,
				last_name: user.last_name,
				id: user.id,
			}
		});
	};

	static getMe = async (req, res) => {
		const user = await Users.findByPk(req.user.id);
		if (!user) {
			throw new APIError('User not found', httpStatus.NOT_FOUND);
		}
		return res.json({
			success: true,
			data: user
		});
	};

	static updateMe = async (req, res) => {
		const user = await Users.findByPk(req.user.id);
		if (!user) {
			throw new APIError('User not found', httpStatus.NOT_FOUND);
		}

		[affected_rows, affected_rows_data] = await user.update(req.body)
		logger.info(`Updated user ${user.id} | ${user.first_name}`)
		return res.json({
			success: true,
			data: user
		});
	};
}

export default AuthController

