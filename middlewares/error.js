"use strict";

import httpStatus from 'http-status';
import Joi from 'joi';

import logger from '../config/logger.js';
import APIError from "../utils/errors/apiError.js"
import env_config from '../config/env_config.js';



export const converter = (err, req, res, next) => {
	if (err instanceof Joi.ValidationError) {
		const errorMessage = err.details.map((d) => {
			return {
				message: d.message,
				location: d.path[1],
				locationType: d.path[0]
			};
		});
		const apiError = new APIError(errorMessage, httpStatus.BAD_REQUEST);
		apiError.stack = err.stack;
		return next(apiError);
	}
	
	if (!(err instanceof APIError)) {
		const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
		const message = err.message || httpStatus[status];
		const apiError = new APIError(message, status, false);
		apiError.stack = err.stack;
		apiError.message = [{ message: err.message }];
		return next(apiError);
	}
	//err.message = [{ message: err.message }];
	return next(err);
};

export const notFound = (req, res, next) => {
	return next(new APIError(`${httpStatus[httpStatus.NOT_FOUND]} ${req.method}:'${req.path}'`, httpStatus.NOT_FOUND));
};

export const handler = (err, req, res, next) => {
	let { status, message } = err;
	if (env_config.NODE_ENV === 'production' && !err.isOperational) {
		status = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}
	logger.error(JSON.stringify(err.message))
	logger.error(err.stack);
	return res.status(status).json({
		status: status,
		errors: message,
		...(env_config.NODE_ENV === 'development' && { stack: err.stack })
	});
};

export default { converter, notFound, handler };
