const catchAsync = (asyncReqFunc) => (req, res, next) => {
	Promise.resolve(asyncReqFunc(req, res, next))
	// .then(() => next())
		.catch((err) => next(err));
};

export default catchAsync;
