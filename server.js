// Setup empty JS object to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server Running on Port: ${port}`);
});

//Get Route set up
app.get('/all', getData);

function getData (req, res) {
    res.send(projectData)
    console.log(projectData)
}

//Post Route set up
app.post('/post', (req, res) => {
    newEntry = {
        temperature: req.body.temperature,
        sunrise: req.body.sunrise,
        sunset: req.body.sunset,
        weather: req.body.weather,
        date: req.body.date,
        feelings: req.body.feelings,
    }
    projectData.push(newEntry)
})
