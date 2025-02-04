const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const axios = require('axios'); // Import axios for making HTTP requests

const app = express();

// Use CORS middleware to allow requests from different origins
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Checks if a number is prime
const isPrime = (value) => {
    if (value <= 1) return false; // Return false for numbers that are less/equal to 1 (not prime numbers) 
    for (let x = 2; x <= Math.sqrt(Math.abs(value)); x++) { // Loop from 2 to the square root of the number
        if (Math.abs(value) % x === 0) return false; // If number is divisible by any number, it is not prime
    }
    return true; // // Return true if no divisor is found
};

// Checks if a number is perfect
const isPerfect = (value) => {
    if (value <= 1) return false; // Return false for numbers that are less/equal to 1 (not perfect numbers)
    let sum = 1; // Start the sum at 1, because 1 is a divisor of all numbers

    const absValue = Math.abs(value);

    for (let x = 2; x <= Math.sqrt(absValue); x++) { // Loop from 2 to the square root of the number
        if (absValue % x === 0) { // If a number divides the value
            sum += x; // Add the divisor to the sum
            if (x !== absValue / x) sum += absValue / x; // Add the complementary divisor if it is different
        }
    }
    return sum === absValue; // If the sum of divisors equals the number, it is perfect
};

// Checks if a number is an Armstrong
const isArmstrong = (value) => {
    const figure = String(Math.abs(value)).split(''); // Convert number to a string and split it into digits
    const power = figure.length; // How many digits the number has
    const sum = figure.reduce((total, element) => total + Math.pow(Number(element), power), 0); // Sum of digits raised to the power
    return sum === Math.abs(value); // If the sum equals the original number, it is an Armstrong number
};

// Calculate the sum of digits of a number
const getDigitSum = (value) => {
    return String(Math.abs(value)) // Convert value to string
        .split('') // Split into individual digits
        .reduce((total, element) => total + Number(element), 0); // Sum the digits
};

// Get the properties of a number (If it is Armstrong, even/odd)
const getProperties = (value) => {
    const properties = [];
    if (isArmstrong(value)) { // If it’s an Armstrong number, add 'armstrong' to the list
        properties.push('armstrong');
    }
    properties.push(value % 2 === 0 ? 'even' : 'odd'); // Check if the number is even or odd, and add that to the list
    return properties; // Return the list of properties
};

// API endpoint to classify a number
app.get('/api/classify-number', async (req, res) => {
    try {
        const number = Number(req.query.number); // Get the number from the URL (e.g., /api/classify-number?number=371)

        // Validate input: Check if the value is a valid integer
        if (isNaN(number)) {
            return res.status(400).json({
                number: req.query.number,
                error: true // If it’s not a valid number, return an error message 400
            });
        }

        // Fetch fun fact about the number from Numbers API
        let funFact;
        try {
            const response = await axios.get(`http://numbersapi.com/${Math.floor(number)}/math`); // Get a fun fact about the number
            funFact = response.data; // Save the response as the fun fact
        } catch (error) {
            funFact = `${number} is a number`; // If something goes wrong, just say it's a number
        }

        // Prepare the response object
        const result = {
            number,
            is_prime: isPrime(number), // Check if the number is prime
            is_perfect: isPerfect(number), // Check if the number is perfect
            properties: getProperties(number), // Get properties (Armstrong, even/odd)
            digit_sum: getDigitSum(number), // Calculate the sum of digits
            fun_fact: funFact // Include the fun fact from Numbers API
        };

        res.json(result); // Return the response as JSON
    } catch (error) {
        res.status(500).json({
            number: req.query.number,
            error: true // Return 500 error if something goes wrong
        });
    }
});

// Start the server and listen on port 5000
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});