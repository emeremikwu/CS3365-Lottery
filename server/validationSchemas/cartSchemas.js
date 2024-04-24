import Joi from 'joi';

export const patch_UpdateCart = Joi.object()
	.xor('body', 'query')
	.keys((() => {
		const properties = {
			index: Joi.number().integer().required(),
			quantity: Joi.number().integer().required(),
		};

		return {
			body: Joi.object().keys({
				...properties,
			}),

			query: Joi.object().keys({
				...properties,
			}),
		};
	})());

export const post_AddToCart = Joi.object()
	.xor('body', 'query')
	.keys((() => {
		const properties = {
			ticket_type_id: Joi.number().integer().required(),
			quantity: Joi.number().integer().required(),
		};

		return {
			body: Joi.object().keys({
				...properties,
			}),

			query: Joi.object().keys({
				...properties,
			}),
		};
	})());
