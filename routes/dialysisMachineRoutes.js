const {
  addDialysisMachine,
  addMultipleDialysisMachines,
  getMachinesByDialysisUnitId,
} = require("../services/dialysisMachineService");

module.exports = async function (fastify, opts) {
  // Route to add a single dialysis machine
  fastify.post("/dialysis-machine", async (request, reply) => {
    try {
      const machineData = request.body;
      const machine = await addDialysisMachine(machineData);
      reply
        .status(201)
        .send({ message: "Dialysis machine added successfully", machine });
    } catch (error) {
      reply.status(500).send({
        error: "Failed to add dialysis machine",
        details: error.message,
      });
    }
  });

  // Route to add multiple dialysis machines
  fastify.post("/dialysis-machines", async (request, reply) => {
    try {
      const { machineData, count } = request.body;
      const machines = await addMultipleDialysisMachines(machineData, count);
      reply
        .status(201)
        .send({ message: "Dialysis machines added successfully", machines });
    } catch (error) {
      reply.status(500).send({
        error: "Failed to add dialysis machines",
        details: error.message,
      });
    }
  });

  // Route to get dialysis machines by dialysis unit ID
  fastify.get("/dialysis-machines/:dialysisUnitId", async (request, reply) => {
    try {
      const { dialysisUnitId } = request.params;

      const machines = await getMachinesByDialysisUnitId(dialysisUnitId);

      if (!machines || machines.length === 0) {
        return reply.status(200).send({machines});
      }

      reply.status(200).send({ machines });
    } catch (error) {
      reply.status(500).send({
        error: "Failed to fetch dialysis machines",
        details: error.message,
      });
    }
  });
};
