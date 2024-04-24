import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/associations.js';
import logger from './logger.js';

// Configure Passport.js to use the local strategy
// [x] - bcrypt the password

const parseUsername = (username) => {
	const emailRe = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

	return emailRe.test(username) ? { email: username } : { username };
};

const local_strategy = new LocalStrategy(
	async (username, password, done) => {
		// verify credentials

		const retObj = parseUsername(username);

		await User.findOne({ where: retObj })

			.then(async (user) => {
				// user not found
				if (!user) return done(null, false, `AUTH - User Not found ${username}`);

				/* // check if there is a non hashed password and compare
				if (password !== user.password) return done(null, false, { message: 'Bad Pasword' }); */

				const isMatch = await bcrypt.compare(password, user.password);

				if (password === user.password) {
					logger.warn(`Unhashed user password for user UID:${user.user_id}`);
					logger.warn('Hashing...');

					// [ ] - move this somewhere else, maybe to a hook or backgroud task
					// don't need to wait for this to finish
					bcrypt.hash(password, 10).then((hash) => {
						user.update({ password: hash });
					})
						.then(() => { logger.debug(`Hashed! (UID:${user.user_id})`); })
						.catch((err) => { logger.error(`Error hashing password for user UID:${user.user_id} | ${err}`); });
				} else if (!isMatch) {
					return done(null, false, `AUTH - Invalid Password - UID:${user.username}`);
				}

				return done(null, user);
			})

			.catch((err) => done(err));
	},
);

passport.serializeUser((user, cb) => {
	process.nextTick(() => {
		// user_id from userAccountModel
		logger.info(`Serializing User UID:${user.user_id}`);
		cb(null, user.user_id);
	});
});

passport.deserializeUser(async (user_id, cb) => {
	process.nextTick(() => {
		logger.info(`Deserializing User UID:${user_id}`);
		User.findByPk(user_id)
			.then((user) => {
				if (!user) return cb(null, false);
				return cb(null, user);
			})

			.catch((err) => cb(err));
	});
});

passport.use(local_strategy);

export default passport;
export { passport as passport_config };
