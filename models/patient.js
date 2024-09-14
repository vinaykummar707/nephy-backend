const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: false,
    },
    viralStatus: {
      type: String,
      enum: ["Positive", "Negative", "Unknown"], // Example statuses
      default: "Unknown",
    },
    regNo: {
      type: String,
      required: false,
      unique: true,
    },
    refDoctor: {
      type: String,
      required: false,
    },
    billingType: {
      type: String,
      enum: ["cash", "credit", "govt", "other"],
      default: "cash",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("Patient", PatientSchema);
