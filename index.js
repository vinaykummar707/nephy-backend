require("dotenv").config();
const fastify = require("fastify")({ logger: true, pluginTimeout: 10000 });
const mongoosePlugin = require("./plugins/mongoose");

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["POST"]
});

// Register the Mongoose plugin
fastify.register(mongoosePlugin);

// Register the user routes
fastify.register(require("./routes/user"));

// Register the hospital routes
fastify.register(require("./routes/hospital"));

// Register the dialysis unit routes
fastify.register(require("./routes/dialysisUnits"));

// Register the bed routes
fastify.register(require("./routes/bed"));
fastify.register(require("./routes/dialysisUnitAdmin"));

// Define a basic route
fastify.get("/", async (request, reply) => {
  return { message: "Hello, Fastify!" };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
