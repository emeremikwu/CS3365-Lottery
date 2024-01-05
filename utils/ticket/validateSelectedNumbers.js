/*
	Will return the index of the first number that is greater than the constraint
	Will return 0 if all numbers are valid
	Will return -1 if the input number string length and constraint length do not match
 */
function validateSelectedNumbers(inputNumberString, inputConstraint, delimiter = ':') {
	const numberArray = inputNumberString.split(':').map(Number);
	const constraintArray = inputConstraint.split(':').map(Number);

	// eslint-disable-next-line no-useless-escape
	const validatorRE = new RegExp(`(\\d+(${delimiter}\\d+)*)$`);

	const inputRE = validatorRE.test(inputNumberString);
	const constraintRE = validatorRE.test(inputConstraint);

	if (!inputRE || !constraintRE) return -1;

	if (numberArray.length !== constraintArray.length) return -1;

	for (let index = 0; index < numberArray.length; index += 1) {
		/*
		*	despite the fact that comparing string integers works by itself,
		*	we'll still use parseInt for good practice and consistency but its not necessary
		*/
		if (Number(numberArray[index]) > Number(constraintArray[index])) return index + 1;
	}

	return 0;
}

export default validateSelectedNumbers;
