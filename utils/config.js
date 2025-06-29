
const logger = require('./logger');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
    logger.info('Development mode');
}

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}