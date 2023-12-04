"use strict";

fetch("/api/auth/me", {
    method: 'GET',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json',
    },
})