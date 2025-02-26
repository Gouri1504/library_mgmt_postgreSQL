const winston = require('winston');
const path = require('path');

// Parameterize log file path (default: logs/app.log)
const logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, 'logs', 'app.log');

// Define log format: [date time] [log level] [function] - Log statement
const logFormat = winston.format.printf(({ level, message, timestamp, functionName }) => {
    return `[${timestamp}] [${level.toUpperCase()}] [${functionName}] - ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
    level: 'info',  // Default log level
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
        winston.format.errors({ stack: true }), // Capture stack traces
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: logFilePath }), // Log to file
        new winston.transports.Console() // Log to console
    ]
});

// Function to log messages with function name
const logMessage = (level, message, functionName = 'unknown') => {
    logger.log({ level, message, functionName });
};

// Export the logger
module.exports = { logger, logMessage };
