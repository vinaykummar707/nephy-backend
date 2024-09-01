const fastifyPlugin = require("fastify-plugin");
const mongoose = require("mongoose");

async function dbConnector(fastify, options,done) {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Establish the Mongoose connection
    await mongoose.connect(dbUri);

    fastify.log.info("MongoDB connected");
  } catch (err) {
    fastify.log.error(err);
    throw err; // Throw the error to fail fast if connection fails
  }
}

module.exports = fastifyPlugin(dbConnector);
