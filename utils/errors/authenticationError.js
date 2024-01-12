import APIError from './apiError.js';
// TODO: implement

class AuthenticationError extends APIError {
	constructor(message, status, isOperational = true, options = {}) {
		super(message, status, isOperational);
		this.options = options;
	}
}
