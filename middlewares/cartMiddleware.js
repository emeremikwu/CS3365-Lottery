import logger from '../config/logger.js';
// TODO: add functionality for users who are not logged in

import { Cart } from '../models/associations.js';
import { cartIncludeClause } from '../models/includeClauses.js';
import EmptyCartError from '../utils/errors/emptyCartError.js';

export class CartMiddleware {
	// ensure that the user has a cart

	/* TODO:
        we can lighten the load by sending and storing the cart_id in the
            session instead of querying the database every time the user makes a request
            this will be a todo for later
    */

	/*
		Attach the user's cart_id to the session
	 */
	static async initializeCart(req, res, next) {
		if (!req.user.cart_id) {
			if (!req.session.cart_id) {
				const [user_cart, created] = await Cart.findOrCreate({
					where: {
						user_id: req.user.user_id,
					},
				});

				if (created) {
					logger.info(`Created cart for user ${req.user.user_id}`);
				}

				req.session.cart_id = user_cart.cart_id;
			}

			req.user.cart_id = req.session.cart_id;
		}

		next();
	}

	// attaches the user cart to the request with the appropriate filtering
	static attachCart = (throwError = false) => async (req, res, next) => {
		const userCart = await req.user.getCart({
			...cartIncludeClause,
		});

		// throw an error of the cart is empty
		if (throwError && !userCart.CartItems.length) throw new EmptyCartError();

		req.user.userCart = userCart;
		next();
	};
}

export default CartMiddleware;
