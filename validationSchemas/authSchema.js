import Joi from 'joi';

export class AuthSchema {
	/* static #signup = {
		body: Joi.object().keys({
			firstName: Joi.string().trim().min(2).max(66).required(),
			lastName: Joi.string().trim().min(2).max(66).required(),
			userName: Joi.string().alphanum().min(6).max(66).required(),
			email: Joi.string().email().required(),
			password: Joi.string().trim().min(6).max(666).required()
		})
	};
 */
	static #signin = {
		body: Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		}),
	};

	static #updateMe = {
		body: Joi.object().keys({
			firstName: Joi.string().trim().min(2).max(50),
			lastName: Joi.string().trim().min(2).max(50),
			address: Joi.string().trim().min(6).max(50),
			address2: Joi.string().trim().min(6).max(50),
			city: Joi.string().trim().min(6).max(50),
			state: Joi.string().trim().min(6).max(50),
			zip: Joi.string().trim().min(6).max(50),
			email: Joi.string().email(),
			password: Joi.string().trim().min(6).max(50),
		}),
	};

	static get signup() {
		return this.#updateMe;// same thting
	}

	static get signin() {
		return this.#signin;
	}

	static get updateMe() {
		return this.#updateMe;
	}
}
export default AuthSchema;
