// routes/dialysisUnit.js
const DialysisUnit = require("../models/dialysisUnit");
const Hospital = require("../models/hospital");
const User = require("../models/user"); // Assuming you have a User model
const checkHospitalAdmin = require("../middleware/checkHospitalAdmin");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/dialysis-units",
    { preHandler: checkHospitalAdmin },
    async (request, reply) => {
      const { hospitalId, unitName, address, phone, capacity, createdBy } =
        request.body;

      try {
        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
          return reply.status(400).send({ error: "Hospital not found" });
        }

        // Check if the user exists
        const user = await User.findById(createdBy);
        if (!user) {
          return reply.status(400).send({ error: "User not found" });
        }

        // Create a new dialysis unit
        const newDialysisUnit = new DialysisUnit({
          hospitalId,
          unitName,
          address,
          phone,
          capacity,
          createdBy,
        });
        await newDialysisUnit.save();

        reply.status(201).send({ message: "Dialysis unit added successfully" });
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Internal Server Error", details: error.message });
      }
    }
  );
};
