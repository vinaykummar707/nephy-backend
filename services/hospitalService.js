const mongoose = require('mongoose');
const Hospital = require('../models/hospital');
const DialysisUnit = require('../models/dialysisUnit');
const Bed = require('../models/bed');

async function createHospitalWithUnitsAndBeds(hospitalData, dialysisUnitData, numOfBeds) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create Hospital
    const hospital = new Hospital(hospitalData);
    await hospital.save({ session });

    // Create Dialysis Unit associated with the Hospital
    const dialysisUnit = new DialysisUnit({
      ...dialysisUnitData,
      hospitalId: hospital._id,
    });
    await dialysisUnit.save({ session });

    // Create Beds associated with the Dialysis Unit
    const beds = [];
    for (let i = 1; i <= numOfBeds; i++) {
      beds.push({
        bedNumber: i,
        dialysisUnitId: dialysisUnit._id,
      });
    }
    await Bed.insertMany(beds, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { hospital, dialysisUnit };
  } catch (error) {
    // Abort transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  createHospitalWithUnitsAndBeds,
};
