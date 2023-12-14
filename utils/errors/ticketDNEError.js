"use strict";

import httpStatus from 'http-status';
import APIError from './apiError.js';

class TicketDNEError extends APIError {
    constructor(message) {
        super(message || 'Ticket does not exist', httpStatus.BAD_REQUEST, true);
        this.name = this.constructor.name;
    }
}

export default TicketDNEError