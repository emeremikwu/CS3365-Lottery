import httpStatus from 'http-status';
import env_config from '../../config/env_config.js';
import APIError from './apiError.js';

env_config.isProduction();

class ReferenceNumberRegexMismatchError extends APIError {
	constructor(referenceNumber, pattern) {
		const msg = `Reference number does not match regex${env_config.isProduction() ? ', this should not have happened' : ''}`;
		super(msg, httpStatus.INTERNAL_SERVER_ERROR, false, true);
		this.referenceNumber = referenceNumber;
		this.pattern = pattern;
	}
}
export default ReferenceNumberRegexMismatchError;
