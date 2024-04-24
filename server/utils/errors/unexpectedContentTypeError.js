import httpStatus from 'http-status';
import APIError from './apiError.js';

class UnexpectedContentTypeError extends APIError {
	constructor(expectedContentType, GivenContentType) {
		const msg = `Expected content type ${expectedContentType} but received ${GivenContentType}`;
		super(msg, httpStatus.BAD_REQUEST);
	}
}
export default UnexpectedContentTypeError;
