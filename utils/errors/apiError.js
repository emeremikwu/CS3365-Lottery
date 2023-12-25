class APIError extends Error {
	constructor(message, status, isOperational = true, includeStack = !isOperational) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isOperational = isOperational;
		if (includeStack) { Error.captureStackTrace(this, this.constructor); }
	}
}

export default APIError;
