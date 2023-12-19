import Joi from 'joi';
import _ from 'lodash';
import catchAsync from '../utils/catchAsync.js';

// v3 catchAsync integration

const validate = (...schemas) => catchAsync(async (req, res, next) => {
	await Promise.all(schemas.map((schema) => {
		// ensure that the schema has atleast one of the following keys
		const validSchema = _.pick(schema, ['params', 'query', 'body']);
		// from the 3 possible parameters in validSchema filter the request object
		const validReqProperties = _.pick(req, Object.keys(validSchema));

		// surround with promise to ensure that all schemas are validated
		return new Promise((resolve, reject) => {
			// store failure|success in appropriate objects
			const { error, value } = Joi.compile(validSchema)
				.prefs({
					abortEarly: false, // return all errors not just the first occurance
					// errors: {
					//     label: "full",
					//     //wrap: { label: false } ,
					// }
				})
				.validate(validReqProperties);

			if (error) {
				reject(error);
				return;
			}
			// assign validated and formatted properties to the request object
			Object.assign(req, value);
			resolve();
		});
	}));

	next();
});

export default validate;
