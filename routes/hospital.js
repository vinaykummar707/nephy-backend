// routes/hospital.js
const Hospital = require('../models/hospital');

module.exports = async function (fastify, opts) {
  fastify.post('/hospitals', async (request, reply) => {
    const { name, branch, address, pincode, phone, email, googleMapCoords, logo, established } = request.body;

    try {
      // Check if the hospital already exists
      const existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return reply.status(400).send({ error: 'Hospital with this email already exists' });
      }

      // Create a new hospital
      const newHospital = new Hospital({ name, branch, address, pincode, phone, email, googleMapCoords, logo, established });
      await newHospital.save();

      reply.status(201).send({ message: 'Hospital added successfully' });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  });
};
