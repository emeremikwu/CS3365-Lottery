"use strict";

console.log("login_script.js loaded");
let loginForm = document.getElementById("loginForm");

/* document.getElementById('myForm')
    .addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents the default form submission behavior

        // Get form data
        const formData = new FormData(event.target);


        console.log(Object.fromEntries(formData));
        

        // Make a POST request using Fetch API
        fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
            redirect: 'follow'
        })
            /* .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle the response as needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            }); 
    });  */