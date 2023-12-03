"use strict";

import APIError from "../utils/apiError.js";
import httpStatus from "http-status"
import { passport_config as passport } from "../config/passport.js";
import { model as UserAccounts } from "../models/userModel.js";
import logger from "../config/logger.js";

// since we're pasing verifyCallback to authenticate, the UserAccountModel object isn't automatically added to the request as user(req.user)
// so we have to assign it ourselves

export class AuthController {

	static verifyCallback = (req) => async (err, user, info) => {
		if (err || info || !user) {
			throw new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED);
		}
		req.user = user;
	}

	static signup = async (req, res) => {
		const user = UserAccounts.create(req.body)
		logger.info(`Created user ${user.id} | ${user.first_name}`)
		return res.status(httpStatus.CREATED).json({
			success: true,
			data: user
		});
	};

	static signin = async (req, res) => {
		await passport.authenticate("local", { failureRedirect: "/login" }, verifyCallback(req))(req, res)
		logger.info(`Successful login attempt\t User: ${req.user.first_name} ID: ${req.user.id} `)
		res.redirect("/profile")
	}

	//returns partial information about the user
	static current = async (req, res) => {
		const user = await UserAccounts.findByPk(req.user.id);
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
		const user = await UserAccounts.findByPk(req.user.id);
		if (!user) {
			throw new APIError('User not found', httpStatus.NOT_FOUND);
		}
		return res.json({
			success: true,
			data: user
		});
	};

	static updateMe = async (req, res) => {
		const user = await UserAccounts.findByPk(req.user.id);
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

