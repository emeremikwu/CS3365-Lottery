import Joi from 'joi';
import _ from 'lodash';
import { addToCart, updateCart } from '../validationSchemas/cartSchemas.js';

console.log(Joi.isSchema(updateCart));
console.log(Joi.isSchema(addToCart));
console.log(Joi.compile(updateCart).describe());
console.log(addToCart.describe());

const tObj = {
	a: [1, 2, 3],
	b: 'hello',
	c: 3,
};

const picked = _.pick(tObj, ['a', 'b']);

console.log('hello world');
