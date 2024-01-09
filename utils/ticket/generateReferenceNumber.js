/* eslint-disable max-len */
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
/*
	Generic reference number to be used for created tickets.
	returns a string in the format:
		tk{ticketType}-{orderNumberLast5}-{orderDate}-{hash}-{*UserInfo*}
		e.g. tk01-12345-2104-1a2b3

		the type of user info is subject to change, see documentation below
	orderDate can be of type DateTime or a string in ISO format

	The purpose of this is to have a unique reference number for each ticket
	and to have a way to identify a ticket without exposing the user_id(only last 5 characters),
	order_id, or ticket_id.

	I'm not sure of the collision rate of this. The format of the reference number has both
	incrementive and random components to it. It should be fine for now.
*/

function generateTicketReference(ticketTypeID, orderID, orderDate, userID = null) {
	// Concatenate user ID, order ID, and additional data
	// s = short or simplified depending on the context
	const sOrderID = orderID.slice(-5);
	const sTypeID = ticketTypeID.toString().padStart(2, '0');
	let sDate = orderDate instanceof DateTime ? orderDate : DateTime.fromISO(orderDate);

	const sUID = userID ? 'UA' : 'NA'; // A = user associated, NA = not associated

	// ensure that the date is valid
	if (sDate.invalidReason) { throw new Error(sDate.invalidReason); } else { sDate = sDate.toFormat('yyLL'); }

	// Combine the data for hashing
	const combinedData = `${ticketTypeID}-${orderID}-${orderDate}-${uuidv4()}`;

	// Create a hash of the combined data to ensure uniqueness
	const hash = crypto.createHash('sha256').update(combinedData).digest('hex');
	const ticketUID = hash.substring(0, 5);

	// Concatenate the data to create the reference number
	// const referenceNumber = `tk${sTypeID}-${sOrderID}-${sDate}-${ticketUID}`.concat(`${sUID ? `-${sUID}` : ''}`);
	const referenceNumber = `tk:${sUID}${sTypeID}-${sOrderID}-${sDate}-${ticketUID}`;
	return referenceNumber;
}

export default generateTicketReference;
