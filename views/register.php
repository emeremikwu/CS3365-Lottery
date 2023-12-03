<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $email = $_POST["email"];
    $address = $_POST["address"];
    $city = $_POST["city"];
    $state = $_POST["state"];
    $phone = $_POST["phone"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    // Database connection (replace with your database credentials)
    $servername = "your_servername";
    $username = "your_username";
    $password = "password";
    $dbname = "your_dbname";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // SQL query to insert data into the database
    $sql = "INSERT INTO users (first_name, last_name, email, address, city, state, phone, password)
            VALUES ('$first_name', '$last_name', '$email', '$address', '$city', '$state', '$phone', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Registration successful!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
