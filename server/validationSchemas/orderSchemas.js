import Joi from 'joi';

export const getPageCount = Joi.object()
	.xor('body', 'query')
	.keys((() => {
		const properties = { pageSize: Joi.number().integer() };

		return {
			body: Joi.object().keys({
				...properties,
			}),

			query: Joi.object().keys({
				...properties,
			}),
		};
	})());

export const getPage = {
	query: Joi.object().keys({
		page: Joi.number().integer().default(1),
		pageSize: Joi.number().integer().optional(),
		last: Joi.number().integer().optional(),
	}),
};

export const getOrderDetails = Joi.object()
	.xor('body', 'query', 'params')
	.keys((() => {
		const properties = { orderID: Joi.string().uuid() };
		return {
			body: Joi.object().keys({
				...properties,
			}),

			query: Joi.object().keys({
				...properties,
			}),

			params: Joi.object().keys({
				...properties,
			}),
		};
	})());
