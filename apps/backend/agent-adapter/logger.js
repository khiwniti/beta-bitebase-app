/**
 * BiteBase Agent Adapter Logger
 * 
 * A Winston-based logger for the agent adapter.
 */

const winston = require('winston');
const { LOGGING } = require('./config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for readability
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: LOGGING.LEVEL,
  format: logFormat,
  defaultMeta: { service: 'agent-adapter' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      dirname: './',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      dirname: './',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ],
  silent: !LOGGING.ENABLED
});

// Create a stream object with a 'write' function that will be used by Morgan
logger.stream = {
  write: function(message, encoding) {
    // Remove the newline character at the end of the message
    logger.info(message.trim());
  }
};

// Add helper methods for common HTTP logging patterns
logger.logRequest = (req, info = {}) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    params: req.params,
    query: req.query,
    body: req.body,
    ...info
  });
};

logger.logResponse = (req, res, info = {}) => {
  logger.info(`${req.method} ${req.path} ${res.statusCode}`, {
    responseTime: info.responseTime,
    ...info
  });
};

logger.logError = (req, err, info = {}) => {
  logger.error(`${req.method} ${req.path} error: ${err.message}`, {
    ip: req.ip,
    params: req.params,
    query: req.query,
    stack: err.stack,
    ...info
  });
};

module.exports = logger; 