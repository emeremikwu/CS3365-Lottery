/* eslint-disable max-len */
// import env_config from '../../config/env_config';

const defaultDelimiter = ':';
const defaultNullChar = '%';

// TODO:

// [ ] - add to env_config
/* env_config.TICKET_NUMBER_STRING_DELIMITER;
env_config.TICKET_NUMBER_STRING_NULL_CHAR; */

// check for stray characters and invalid delimiters
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
function validateStrict(inputNumberString, inputConstraint, delimiter = defaultDelimiter) {
	const reResult = reValidation(inputNumberString, inputConstraint, delimiter, defaultNullChar);
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
function validateParital(inputNumberString, inputConstraint, nullChar = defaultNullChar, delimiter = defaultDelimiter) {
	const reResult = reValidation(inputNumberString, inputConstraint, delimiter, nullChar);
	if (reResult) return [];

	const [numberArray, constraintArray] = split(inputNumberString, inputConstraint, delimiter);
	if (numberArray.length > constraintArray.length) return [];

	const resultArray = Array(constraintArray.length).fill(true);

	for (let index = 0; index < numberArray.length; index += 1) {
	// readable and maintainable
		if (numberArray[index] !== nullChar && Number(numberArray[index]) > Number(constraintArray[index])) {
			resultArray[index] = false;
		}
	}

	return resultArray;
}

// Format the selected numbers to be stored in the db
// pads the numbers with 0s and rejoins them with the delimiter or a new delimiter if provided
function formatNumbers(selectedNumbers, delimiter = defaultDelimiter, newDelimiter = null) {
	const newNumbers = selectedNumbers
		.split(delimiter)
		.map((strNumber) => strNumber.padStart(2, '0'))
		.join(newDelimiter || delimiter);
	return newNumbers;
}

export {
	validateStrict,
	validateParital,
	formatNumbers,
};
