/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

export const signup = {
	body: Joi.object().keys({
		first_name: Joi.string().trim().min(2).max(66).required(),
		last_name: Joi.string().trim().min(2).max(66).required(),
		username: Joi.string().lowercase().alphanum().min(6).max(66).required(),
		email: Joi.string().lowercase().email().required(),
		password: Joi.string().trim().min(6).max(666).required(),
	}),
};

export const signin = {
	body: Joi.object().keys({
		username: Joi.string().lowercase().alphanum().min(6).max(66).optional(),
		email: Joi.string().lowercase().email().optional(),
		password: Joi.string().required(),
	}).xor('username', 'email'),
};

export const updateMe = {
	body: Joi.object().keys({
		first_name: Joi.string().trim().min(2).max(50),
		last_name: Joi.string().trim().min(2).max(50),
		address: Joi.string().trim().min(6).max(50),
		address2: Joi.string().trim().min(6).max(50),
		city: Joi.string().trim().min(4).max(30),
		state: Joi.string().trim().min(6).max(30),
		zip: Joi.string().trim().length(5),
		username: Joi.string().lowercase().alphanum().min(6).max(50),
		email: Joi.string().lowercase().email(),
		password: Joi.string().trim().min(6).max(50),
	}),
};
