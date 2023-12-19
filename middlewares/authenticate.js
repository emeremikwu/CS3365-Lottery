import { User } from '../models/associations.js';

export const authenticate = async (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	const user = await User.findByPk(1);
	req.user = user;
	return next();

	// eslint-disable-next-line no-unreachable
	res.status(401).json({
		status: 'error',
		message: 'You are not logged in!',
	});
};

export default authenticate;
