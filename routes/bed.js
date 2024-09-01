// routes/bed.js
const Bed = require("../models/bed");
const DialysisUnit = require("../models/dialysisUnits");
const { BedStatus } = require("../utils/enums");
const checkAdminRole = require("../middleware/checkAdminRole");

module.exports = async function (fastify, opts) {
  // Route to create beds for a dialysis unit
  fastify.post(
    "/beds",
    { preHandler: checkAdminRole },
    async (request, reply) => {
      const { dialysisUnitId, numberOfBeds } = request.body;

      try {
        const dialysisUnit = await DialysisUnit.findById(dialysisUnitId);
        if (!dialysisUnit) {
          return reply.status(400).send({ error: "Dialysis Unit not found" });
        }

        const beds = Array.from({ length: numberOfBeds }, (_, i) => ({
          dialysisUnitId,
          bedNumber: i + 1,
          status: BedStatus.AVAILABLE, // Default status to available
        }));

        await Bed.insertMany(beds);

        reply.status(201).send({ message: "Beds added successfully", beds });
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Internal Server Error", details: error.message });
      }
    }
  );

  // Route to get all beds for a dialysis unit
  fastify.get("/beds/:dialysisUnitId", async (request, reply) => {
    const { dialysisUnitId } = request.params;

    try {
      const beds = await Bed.find({ dialysisUnitId });
      if (!beds) {
        return reply
          .status(404)
          .send({ error: "No beds found for this dialysis unit" });
      }

      reply.send(beds);
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  });

  // Route to update the status of a bed
  fastify.patch("/beds/:id/status", async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;

    try {
      if (![BedStatus.OCCUPIED, BedStatus.AVAILABLE].includes(status)) {
        return reply.status(400).send({ error: "Invalid status value" });
      }

      const bed = await Bed.findById(id);
      if (!bed) {
        return reply.status(404).send({ error: "Bed not found" });
      }

      bed.status = status;
      await bed.save();

      reply.send({ message: "Bed status updated successfully", bed });
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  });
};
