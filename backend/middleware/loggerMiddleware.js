// loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${method} ${url}`);

    // Call the next middleware or route handler
    next();
};

export default loggerMiddleware;
