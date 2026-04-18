// Importing the express module
const express = require("express");
const { rateLimiter } = require("./middleware/RateLimiter");
const RedisHandler = require('./common/RedisHandler')

// Instantiating an object express
const app = express();

// Using the express object, handle the default '/' route for GET requests
app.get("/", (req, res) => {
    return res.send(`Access the following API routes: <ul> 
            <li>
                <a href='/api-one'>API 1</a> 
            </li>
            <li>
                <a href='/api-two'>API 2</a> 
            </li>
            <li>
                <a href='/api-three'>API 3</a> 
            </li>
            <li>
                <a href='/api-four'>API 4</a> 
            </li>
        </ul>`);
});

// Using the express object, handle the default '/api-one' route for GET requests
app.get("/api-one", rateLimiter(10, 5, "API 1"), async (req, res) => {
    
    // Business logic can be executed here

    return res.json({
        status: "Success",
        apiMessage: "API 1",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

// Using the express object, handle the default '/api-two' route for GET requests
app.get("/api-two", rateLimiter(4, 1, "API 2"), async (req, res) => {
    
    // Business logic can be executed here

    return res.json({
        status: "Success",
        apiMessage: "API 2",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

// Using the express object, handle the default '/api-three' route for GET requests
app.get("/api-three", rateLimiter(5, 3, "API 3"), async (req, res) => {
    
    // Business logic can be executed here
    
    return res.json({
        status: "Success",
        apiMessage: "API 3",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

// Using the express object, handle the default '/api-four' route for GET requests
app.get("/api-four", rateLimiter(20, 10, "API 4"), async (req, res) => {
    
    // Business logic can be executed here
    
    return res.json({
        status: "Success",
        apiMessage: "API 4",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

// Using the express object to listen to port 8000 for incoming requests
app.listen(8000, async () => {
    await RedisHandler.init()
    console.log("The App is listening on port 8000!");
});