import Joi from 'joi';
import _ from 'lodash';
import catchAsync from '../utils/catchAsync.js';
import UnexpectedContentTypeError from '../utils/errors/unexpectedContentTypeError.js';

function validateContentType(request, content_type = [], throwError = true) {
	const result = content_type.some((type) => request.headers['content-type'] === type);

	if (!result && throwError) { throw new UnexpectedContentTypeError(content_type, request.headers['content-type']); } else return result;
}
// v3 catchAsync integration

/*
	Validates the request object against a list  schemsas and a content types
	schemas and contentt content_type should be arrays but can be singular values, arrays preferred
 */
const validate = (schemas = [], content_type = ['application/json']) => catchAsync(async (req, res, next) => {
	// should probably avoid mixing types but this ensures that the schemas are always an array
	const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
	const contentTypeArray = Array.isArray(content_type) ? content_type : [content_type];

	validateContentType(req, contentTypeArray);

	const validationPromises = schemaArray.map(async (schema) => {
		// ensure that the schema has atleast one of the following keys

		const validSchema = Joi.isSchema(schema) ? schema : _.pick(schema, ['params', 'query', 'body']);

		const joiSchemaObj = Joi.compile(validSchema)
			.prefs({
				abortEarly: false, // return all errors not just the first occurance
			// errors: {
			//     label: "full",
			//     //wrap: { label: false } ,
			// }
			});

		// eslint-disable-next-line no-underscore-dangle
		const joiSchemaObj_keys = Array.from(joiSchemaObj._ids._byKey.keys());

		// pull the present keys from the Joi schema object
		const reqProperties = Object.entries(_.pick(req, joiSchemaObj_keys))
			.filter(([, value]) => Object.keys(value).length);

		// create an object from the entries
		const validReqProperties = Object.fromEntries(reqProperties);

		// validate the request object against the schema
		const value = await joiSchemaObj.validateAsync(validReqProperties);

		// assign validated and formatted properties to the request object
		Object.assign(req, value);
	});

	await Promise.all(validationPromises);
	next();
});

export default validate;
