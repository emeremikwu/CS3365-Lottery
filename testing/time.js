import { DateTime } from 'luxon';
import { v4 } from 'uuid';

const time = DateTime.fromObject({ day: 27 });

console.log(time.toISO());
console.log(time.set({ year: 2019 }).toISO());

console.log(time.minus({ days: 90 }).toLocaleString(DateTime.DATE_MED));

console.log(v4());
