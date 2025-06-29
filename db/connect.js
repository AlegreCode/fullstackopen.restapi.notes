
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../utils/config');

const uri = config.MONGODB_URI;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    logger.info("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    logger.error(error);
  }
}

module.exports = connect;
