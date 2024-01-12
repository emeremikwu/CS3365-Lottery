import httpStatus from 'http-status';
/*
	checks if the user is authenticated
	initalizes req.user to null if Proceed
 */

const authenticate = (proceedOnFailure = false) => (req, res, next) => {
	/* const user = await User.findByPk(1);
	req.user = user;
	return next(); */

	// if the isAuthenticated function exists and returns true, continue
	if (req.isAuthenticated()) {
		return next();
	}

	if (proceedOnFailure) {
		req.user = null;
		return next();
	}

	return res.status(httpStatus.UNAUTHORIZED).json({
		message: 'You are not logged in',
	});
};

export default authenticate;
