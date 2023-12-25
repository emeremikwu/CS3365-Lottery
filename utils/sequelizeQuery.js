import { DateTime } from 'luxon';
import { Op } from 'sequelize';

/*
	returns the month token for luxon given the month_value param
	e.g input: "12" (december), 	output: MM
		input: "October"			output: MMMM
		input: "jan"				output: MMM
		https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 */
export const getMonthAbbreviation = (month_value = '') => {
	if (!Number.isNaN(month_value) && Number.isInteger(Number(month_value))) {
		const month_number = Number(month_value);

		if (month_number > 12 || month_number < 1) throw new Error('Month number is out of range');

		return 'MM';
	}

	if (!month_value || typeof month_value !== 'string' || month_value.length < 3) throw new Error('Invalid month string');

	const month_abberivation = month_value.length > 3 ? 'MMMM' : 'MMM';
	const err = DateTime.fromFormat(`${month_value}`, month_abberivation).invalidReason;

	if (err) throw new Error(err);

	return month_abberivation;
};

/*
	returns an object containing the "where" clause for sequelize given a query object
*/

export const sequelizeQuery_date = (query) => {
	const query_entries = Object.entries(query);
	let extracted_time = DateTime.now();
	let range_message = 'last 90 days';

	const sequelized_object = {
		where: {
			date: { [Op.gte]: DateTime.now().minus({ days: 90 }).startOf('day').toISO() },
		},
	};

	query_entries.forEach(([key, value]) => {
		switch (key) {
		case 'year':
			extracted_time = DateTime.fromObject({ year: value });

			sequelized_object.where.date = {
				[Op.between]: [
					extracted_time.toISO(),
					extracted_time.endOf('year').toISO(),
				],
			};
			range_message = `year ${value}`;
			break;

		case 'month':
			extracted_time = DateTime.fromFormat(value, getMonthAbbreviation(value));
			sequelized_object.where.date = {
				[Op.between]: [
					extracted_time.toISO(),
					extracted_time.endOf('month').toISO(),
				],
			};
			range_message = extracted_time.toFormat('MMMM yyyy');
			break;

		case 'last':
			sequelized_object.where.date = {
				[Op.gte]: DateTime.now().minus({ days: value }).startOf('day').toISO(),
			};
			range_message = `last ${value} days`;
			break;

		default:
			break;
		}
	});
	return [sequelized_object, range_message];
};
