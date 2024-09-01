const DialysisUnitAdmin = require('../models/dialysisUnitAdmin');
const User = require('../models/user');

module.exports = async function (fastify, opts) {
  // Route to find the admin assigned to a specific dialysis unit
  fastify.get('/dialysis-units/:dialysisUnitId/admin', async (request, reply) => {
    const { dialysisUnitId } = request.params;

    try {
      const dialysisUnitAdmin = await DialysisUnitAdmin.findOne({ dialysisUnitId }).populate('userId');
      if (!dialysisUnitAdmin) {
        return reply.status(404).send({ error: 'No admin found for this dialysis unit' });
      }

      reply.status(200).send({ admin: dialysisUnitAdmin.userId });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  });

  // Additional routes related to dialysis unit admins can go here...
};
