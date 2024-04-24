import httpStatus from 'http-status';
import APIError from './apiError.js';

class InvalidCartIndexError extends APIError {
	constructor(message, index) {
		super(message || `Invalid Index, Beginning Starts at '1'. provided:'${index}'`, httpStatus.BAD_REQUEST, true);
		this.name = this.constructor.name;
	}
}

export default InvalidCartIndexError;
