import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import APIError from '../utils/errors/apiError.js';
import { passport_config as passport } from '../config/passport.js';
import logger from '../config/logger.js';
import { User } from '../models/associations.js';
import env_config from '../config/env_config.js';

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
	if (err) {
		return reject(new APIError(
			err.message || err,
			httpStatus.INTERNAL_SERVER_ERROR,
			false,
		));
	}

	if (!user) {
		return reject(new APIError(
			info,
			httpStatus.UNAUTHORIZED,
			false,
		));
	}
	// req.user = user; //not needed since were calling login, jwt would need this

	// logger.info(`User logged in:  ${user.id}-${user.first_name}`)

	return req.login(user, () => resolve());
};

function formatUserData(user) {
	return env_config.isProduction() ? _.omit(user, ['password']) : user;
}

// eslint-disable-next-line max-len
// since we're pasing verifyCallback to authenticate, the UserAccountModel object isn't automatically added to the request as user(req.user)
// so we have to assign it ourselves

class AuthController {
	static signup = async (req, res) => {
		const saltRounds = 10;
		const { password: unhashedPassword } = req.body;

		const existingEmail = await User.findOne({ where: { email: req.body.email } });
		const existingUsername = await User.findOne({ where: { username: req.body.username } });

		if (existingEmail || existingUsername) {
			throw new APIError(`${existingEmail ? 'Email' : 'Username'} already in use`, httpStatus.BAD_REQUEST);
		}

		// this could also be done as a hook in the database
		await bcrypt.hash(unhashedPassword, saltRounds).then((hash) => {
			const newPassword = { password: hash };
			Object.assign(req.body, newPassword);
		});

		const user = await User.create(req.body);
		logger.info(`AUTH - Created user - ${user.email} | ${user.user_id}`);
		return res.status(httpStatus.CREATED).json({
			message: 'User created',
			user: formatUserData(user),
		});
	};

	static async signin(req, res, next) {
		if (req.body.email) req.body.username = req.body.email;

		const authenticationPromise = new Promise((resolve, reject) => {
			passport.authenticate(
				'local',
				{ failureRedirect: '/index.html', failureMessage: true },
				verifyCallback(req, resolve, reject),
			)(req, res, next);
		});

		return authenticationPromise
			.then(() => {
				logger.info(`AUTH - login - ${req.user.email} | ${req.user.user_id}`);
				res.redirect('/profile.html');
			});
	}

	// returns partial information about the user
	static async current(req, res) {
		const { user } = req;
		return res.json({
			data: {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				username: user.username,
				id: user.user_id,
			},
		});
	}

	static async signout(req, res) {
		req.logout((err) => {
			if (err) {
				logger.error(`Error logging out: ${err}`);
				throw new APIError('Error logging out', httpStatus.INTERNAL_SERVER_ERROR);
			}
		});

		logger.info(`AUTH - Logout - ${req.user.email} | :${req.user.user_id}`);

		res.status(httpStatus.INTERNAL_SERVER_ERROR).redirect('/');
	}

	static async getMe(req, res) {
		const { user } = req;
		res.json({
			success: true,
			data: formatUserData(user),
		});
	}

	static async updateMe(req, res) {
		const { user } = req;

		const affected = await user.update(req.body);
		logger.info(`Updated user ${user.email} | ${user.user_id}`);
		logger.info(`Affected: ${affected}`);

		return res.json({
			success: true,
			data: formatUserData(user),
		});
	}
}

export default AuthController;
