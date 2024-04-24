import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import generateRef from '../utils/ticket/generateReferenceNumber.js';

// Example usage:
const userId = 2;
const orderId = v4();
const orderDate = DateTime.now().toISO();

const ticketReference = generateRef(userId, orderId, orderDate);
console.log(ticketReference);
