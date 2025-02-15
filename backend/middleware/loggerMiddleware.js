// loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata", // Change as needed
        hour12: true,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    console.log(`📡 Incoming request: ${timestamp} ${method} ${url}`);

    // Call the next middleware or route handler
    next();
};

export default loggerMiddleware;
