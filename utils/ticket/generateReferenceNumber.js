import crypto from 'crypto';

function generateTicketReference(userId, orderId, additionalData) {
	// Concatenate user ID, order ID, and additional data
	const combinedData = `${userId}-${orderId}-${additionalData}`;

	// Create a hash of the combined data to ensure uniqueness
	const hash = crypto.createHash('sha256').update(combinedData).digest('hex');

	// You can further manipulate the hash or truncate it if needed
	const referenceNumber = hash.substring(0, 10); // Example: Use the first 10 characters

	return referenceNumber;
}

// Example usage:
const userId = 'abcd';
const orderId = 456;
const additionalData = 'someAdditionalInfo';

const ticketReference = generateTicketReference(userId, orderId, additionalData);
console.log(ticketReference);
