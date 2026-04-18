// Import the RedisHandler instance
const RedisHandler = require('../common/RedisHandler')

// Function to check if the API call is valid for the IP address
function rateLimiter(secondsWindow, allowedAPIHits, apiMessage) {

    // A function (middleware) is returned
    return async function (req, res, next) {

        // Get the redis client instance
        const redisClient = await RedisHandler.getRedisClient()

        // Get the IP address of the client using the request object
        let ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Clean the IP address
        if (ipAddress.substr(0, 7) == "::ffff:") {
            ipAddress = ipAddress.substr(7);
        }

        // Increment the count for the key IPAddress followed by the API message
        const numRequests = await redisClient.incr(ipAddress + apiMessage);
        let ttl = secondsWindow;

        // Check if this is the first request, then set the expiry of the key
        // for the IP address
        if (numRequests == 1)
            await redisClient.expire(ipAddress + apiMessage, secondsWindow);
        
        // If not, then get the time left for the key to get expired
        else
            ttl = await redisClient.ttl(ipAddress + apiMessage);

        // If the number of requests are higher than the allowed limit
        // return an error object with the status code 503
        if (numRequests > allowedAPIHits) {
            return res.status(503).json({
                status: "Failure",
                apiMessage: apiMessage,
                callsMadeInAWindow: numRequests,
                timeLeft: ttl,
            });
        } 
        // If not, then modify the request object to contain the number of 
        // requests, time left for the window to reset and finally call the next
        // middleware in the API route.
        else {
            req.numRequests = numRequests;
            req.timeLeft = ttl;
            next();
        }
    };
}

// Export the function to be consumed by external modules
module.exports = {
    rateLimiter,
};