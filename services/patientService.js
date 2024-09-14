const mongoose = require("mongoose");
const Patient = require("../models/patient");

const getPatientWithDetails = async (patientId) => {
  try {
    const patientAggregation = await Patient.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(patientId) }, // Match the patient by patientId
      },
      {
        $lookup: {
          from: "users", // The User collection
          localField: "userId", // Field in the Patient collection
          foreignField: "_id", // Field in the User collection
          as: "user", // Alias for the joined result
        },
      },
      {
        $unwind: "$user", // Unwind the user array to get a single object
      },
      {
        $lookup: {
          from: "profiles", // The Profile collection
          localField: "user._id", // Field in the User collection
          foreignField: "userId", // Field in the Profile collection
          as: "user.profile", // Alias for the joined profile
        },
      },
      {
        $unwind: {
          path: "$user.profile", // Unwind the profile array
          preserveNullAndEmptyArrays: true, // Optional: To allow users without profiles
        },
      },
      {
        $lookup: {
          from: "hospitals", // The Hospital collection
          localField: "hospitalId", // Field in the Patient collection
          foreignField: "_id", // Field in the Hospital collection
          as: "hospital", // Alias for the joined hospital
        },
      },
      {
        $unwind: "$hospital", // Unwind the hospital array
      },
    ]);

    if (patientAggregation.length === 0) {
      throw new Error("Patient not found");
    }

    return patientAggregation[0]; // Return the first (and only) result
  } catch (error) {
    throw new Error(error.message);
  }
};

// Service to get all patients by hospital ID
const getPatientsByHospitalId = async (hospitalId) => {
  try {
    return await Patient.find({ hospitalId })
      .populate("userId", "firstname lastname email")
      .populate("hospitalId", "name branch");
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getPatientWithDetails,
  getPatientsByHospitalId,
};
