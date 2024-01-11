// import env_config from '../../config/env_config';
// TODO:
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import ReferenceNumberRegexMismatchError from '../errors/referenceNumberRegexMismatchError.js';

const DELIMITER = ':';
const NULLCHAR = '%';
/*
	Named capture groups:
		account: NA or UA - not associated or user associated
		type: ticket type id
		id: order id
		date: order date
		hash: hash of the combined data
 */
const refernceNumberRegex = /(?:tk:)?(?<account>NA|UA)(?<type>\d{0,3})-(?<id>[A-Za-z0-9]+)-(?<date>\d{4})-(?<hash>[A-Za-z0-9]+)/;

// [ ] - add to env_config
/* env_config.TICKET_NUMBER_STRING_DELIMITER;
env_config.TICKET_NUMBER_STRING_NULL_CHAR; */

// checks for stray characters and invalid delimiters
function reValidation(inputNumberString, inputConstraint, delimiter, nullChar) {
	// eslint-disable-next-line no-useless-escape
	// const validatorRE = new RegExp(`(\\d+(${delimiter}\\d+)*)$`);

	const validatorRE = new RegExp(`((\\d|${nullChar})(${delimiter}(\\d|${nullChar}))*)$`);

	const inputRE = validatorRE.test(inputNumberString);
	const constraintRE = validatorRE.test(inputConstraint);

	if (!inputRE || !constraintRE) return -1;

	return 0;
}

function split(inputNumberString, inputConstraint, delimiter) {
	const numberArray = inputNumberString.split(delimiter).map(Number);
	const constraintArray = inputConstraint.split(delimiter).map(Number);

	return [numberArray, constraintArray];
}

/*
 * 	Ensure that the input number string is valid
 *	Returns the index of the first number that is greater than the constraint
 *	Returns 0 if all numbers are valid
 *	Returns -1 if the input number string length and constraint length do not match
 *  Returns -1 if the input number string or constraint contains stray characters
 */

// [ ] - return failure message, validatePartial aswell
function validateStrict(inputNumberString, inputConstraint, delimiter = DELIMITER) {
	const reResult = reValidation(inputNumberString, inputConstraint, delimiter, NULLCHAR);
	if (reResult) return reResult;

	const [numberArray, constraintArray] = split(inputNumberString, inputConstraint, delimiter);

	if (numberArray.length !== constraintArray.length) return -1;

	for (let index = 0; index < numberArray.length; index += 1) {
		/*
		 	despite the fact that comparing string integers works by itself,
		 	we'll still use parseInt for good practice and consistency but its not necessary
		 */
		if (Number(numberArray[index]) > Number(constraintArray[index])) return index + 1;
	}

	return 0;
}

/*
 * 	Validate the input number string against the constraint
 * 	Returns an array of booleans corresponding to the input number string
 *  if the value is grea
 *  Useful for live validations on the client side
 */

// not gonna work
function validateParital(inputNumStr, inputConstraint, nullChar = NULLCHAR, delimiter = DELIMITER) {
	const reResult = reValidation(inputNumStr, inputConstraint, delimiter, nullChar);
	if (reResult) return [];

	const [numberArray, constraintArray] = split(inputNumStr, inputConstraint, delimiter);
	if (numberArray.length > constraintArray.length) return [];

	const resultArray = Array(constraintArray.length).fill(true);

	for (let index = 0; index < numberArray.length; index += 1) {
	// readable and maintainable
		if (numberArray[index] !== nullChar
			&& Number(numberArray[index]) > Number(constraintArray[index])) {
			resultArray[index] = false;
		}
	}

	return resultArray;
}

// Format the selected numbers to be stored in the db
// pads the numbers with 0s and rejoins them with the delimiter or a new delimiter if provided
function formatNumbers(selectedNumbers, delimiter = DELIMITER, newDelimiter = null) {
	const newNumbers = selectedNumbers
		.split(delimiter)
		.map((strNumber) => strNumber.padStart(2, '0'))
		.join(newDelimiter || delimiter);
	return newNumbers;
}

/*
	Generic reference number to be used for created tickets.
	returns a string in the format:
		tk:{userAssociated}{ticketType}-{orderNumberLast5}-{orderDate(YY/mm)}-{hash}
		e.g. tk:UA01-12345-2104-1a2b3

	The purpose of this is to have a unique reference number for each ticket
	and to have a way to identify a ticket without exposing the user_id(only last 5 characters),
	order_id, or ticket_id.

	I'm not sure of the collision rate of this. The format of the reference number has both
	incrementive and random components to it. It should be fine for now.
*/

function generateRefernceNumber(ticketTypeID, orderID, orderDate, userID = null) {
	// Concatenate user ID, order ID, and additional data
	// s = short or simplified depending on the context
	const sOrderID = orderID.slice(-5);
	const sTypeID = ticketTypeID.toString().padStart(2, '0');
	let sDate = orderDate instanceof DateTime ? orderDate : DateTime.fromISO(orderDate);

	const sUID = userID ? 'UA' : 'NA'; // A = user associated, NA = not associated

	// ensure that the date is valid
	if (sDate.invalidReason) { throw new Error(sDate.invalidReason); } else { sDate = sDate.toFormat('yyLL'); }

	// Combine the data for hashing
	const combinedData = `${ticketTypeID}-${orderID}-${orderDate}-${userID || uuidv4()}`;

	// Create a hash of the combined data to ensure uniqueness
	const hash = crypto.createHash('sha256').update(combinedData).digest('hex');
	const ticketUID = hash.substring(0, 5);

	// Concatenate the data to create the reference number

	const referenceNumber = `tk:${sUID}${sTypeID}-${sOrderID}-${sDate}-${ticketUID}`;

	if (!refernceNumberRegex.test(referenceNumber)) {
		throw new ReferenceNumberRegexMismatchError(referenceNumber, refernceNumberRegex);
	}

	return referenceNumber;
}

export {
	refernceNumberRegex,
	validateStrict,
	validateParital,
	formatNumbers,
	generateRefernceNumber,
};
