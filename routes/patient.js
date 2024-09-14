const patientService = require("../services/patientService");

module.exports = async function (fastify, opts) {
  fastify.get("/patient/:patientId", async (request, reply) => {
    const { patientId } = request.params;

    try {
      const patientData = await patientService.getPatientWithDetails(patientId);
      reply.send({ success: true, data: patientData });
    } catch (error) {
      reply.code(404).send({ success: false, message: error.message });
    }
  });

  fastify.get("/patients/hospital/:hospitalId", async (request, reply) => {
    try {
      const { hospitalId } = request.params;
      const patients = await patientService.getPatientsByHospitalId(hospitalId);
      reply.send(patients);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });
};
