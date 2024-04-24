import Joi from 'joi';
import { refernceNumberRegex } from '../utils/ticket/ticketNumberTools.js';

export const patch_SelectNumbers = (() => {
	const ticketKeyPattern = Joi.object().pattern(
		// the key
		Joi.alternatives(
			Joi.number().integer(),
			Joi.string().regex(/^\w$/), // ticket id, will be removed
			Joi.string().regex(refernceNumberRegex),
		),
		// the value
		Joi.string(),
	);

	return {
		body: Joi.object().keys({
			tickets: ticketKeyPattern.required(),
			haultOnError: Joi.boolean().optional(),
		}),

		query: Joi.object().keys({
			haultOnError: Joi.boolean().optional(),
		}),
	};
})();

export const get_ValidateNumbers = (() => {
	const ticketTypeObjectPattern = Joi.object().pattern(
		// key
		Joi.alternatives(
			Joi.number().integer(),
			Joi.string().regex(/^\w$/), // ticket id, will be removed
		),
		// value
		Joi.string(),
	);

	return {
		body: Joi.alternatives().try(
			ticketTypeObjectPattern,
			Joi.array().items(ticketTypeObjectPattern),
		).required(),
	};
})();
