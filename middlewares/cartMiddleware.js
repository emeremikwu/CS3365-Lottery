import { logger } from '../config/logger.js';
// TODO: add functionality for users who are not logged in

import { Cart, CartItem, TicketType } from '../models/associations.js';
import EmptyCartError from '../utils/errors/emptyCartError.js';

export class CartMiddleware {
	// ensure that the user has a cart

	/* TODO:
        we can lighten the load by sending and storing the cart_id in the
            session instead of querying the database every time the user makes a request
            this will be a todo for later
    */

	// request based
	// static async cartInitializer(req, res, next) {
	//     if (!req.user.cart_id) {
	//         const [user_cart, created] = await Cart.findOrCreate({
	//             where: {
	//                 user_id: req.user.user_id
	//             }
	//         })

	//         if (created) {
	//             logger.info(`Created cart for user ${req.user.user_id}`)
	//         }

	//         req.user.cart_id = user_cart.cart_id
	//     }

	//     next()
	// }

	// session based
	// will prevent the need to query the database every time the user makes a request
	// wont make a difference if we usse db based sessions
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
	static filterAndAttachCart = (throwError = false) => async (req, res, next) => {
		const userCart = await req.user.getCart({
			include: {
				model: CartItem, // model name is cart_items
				include: {
					model: TicketType,
					attributes: ['name', 'price', 'description', 'type_id'],
				},
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		// throw an error of the cart is empty
		if (throwError && !userCart.CartItems.length) throw new EmptyCartError();

		req.user.filteredCart = userCart;
		next();
	};
}

export default CartMiddleware;
