// routes/hospital.js
const DialysisUnit = require('../models/dialysisUnit');
const Hospital = require('../models/hospital');
const mongoose = require("mongoose");
const { createHospitalWithUnitsAndBeds } = require('../services/hospitalService');


module.exports = async function (fastify, opts) {
  // fastify.post('/hospitals', async (request, reply) => {
  //   const { name, branch, address, pincode, phone, email, googleMapCoords, logo, established, createdBy, unitName,description } = request.body;

  //   try {
  //     // Check if the hospital already exists
  //     const existingHospital = await Hospital.findOne({ createdBy: createdBy });
  //     console.log(existingHospital);
      
  //     if (existingHospital) {
  //       return reply.status(400).send({ error: 'Hospital with this email already exists' });
  //     }

  //     // Create a new hospital
  //     const newHospital = new Hospital({ name, branch, address, pincode, phone, email, googleMapCoords, logo, established, createdBy });
  //     await newHospital.save();
  //     const dialysisUnit = new DialysisUnit({hospitalId: newHospital.id,unitName,description,createdBy})
  //     await dialysisUnit.save();

  //     reply.status(201).send({ message: 'Hospital and dialysis unit added successfully' });
  //   } catch (error) {
  //     reply.status(500).send({ error: 'Internal Server Error', details: error.message });
  //   }
  // });
  fastify.post('/hospitals', async (request, reply) => {
    const { name, branch, address, googleMapCoords, phone, pincode, city, country, createdBy, unitName,description,bedCount } = request.body;
    const dialysisUnitData = { unitName,description, createdBy }; // Example dialysis unit data
    const numOfBeds = bedCount; // Example number of beds

    try {
      const result = await createHospitalWithUnitsAndBeds(
        { name, branch, address, googleMapCoords, phone, pincode, city, country, createdBy },
        dialysisUnitData,
        numOfBeds
      );

      reply.status(201).send({ message: 'Hospital, Dialysis Unit, and Beds created successfully', result });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  });
  fastify.get('/hospitals/:userId', async (request, reply) => {
    const { userId } = request.params;

    try {
      // Validate userId as ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return reply.status(400).send({ error: 'Invalid userId' });
      }

      // Find hospitals where createdBy matches userId
      const hospital = await Hospital.findOne({ createdBy: new mongoose.Types.ObjectId(userId) });

      if (!hospital) {
        return reply.status(200).send(hospital);
      }

      reply.status(200).send(hospital);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  });
};
 