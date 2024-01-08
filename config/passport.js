import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/associations.js';
import logger from './logger.js';

// Configure Passport.js to use the local strategy

const local_strategy = new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		// verify credentials

		await User.findOne({ where: { email } })

			.then((user) => {
				// user not found
				if (!user) return done(null, false, { message: 'User Not found' });

				// check if there is a non hashed password and compare
				if (password !== user.password) return done(null, false, { message: 'Bad Pasword' });
				return done(null, user);
			})

			.catch((err) => done(err));
	},
);

passport.serializeUser((user, cb) => {
	process.nextTick(() => {
		// user_id from userAccountModel
		logger.info(`Serializing User ${user.user_id}`);
		cb(null, user.user_id);
	});
});

passport.deserializeUser(async (user_id, cb) => {
	process.nextTick(() => {
		logger.info(`Deserializing User ${user_id}`);
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
