// models/bed.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { BedStatus } = require("../utils/enums");

const bedSchema = new Schema(
  {
    dialysisUnitId: {
      type: Schema.Types.ObjectId,
      ref: "DialysisUnit",
      required: [true, "Dialysis Unit ID is required"],
    },
    bedNumber: {
      type: Number,
      required: [true, "Bed Number is required"],
      unique: true, // Ensure that bed numbers are unique within a unit
    },
    status: {
      type: String,
      enum: [BedStatus.OCCUPIED, BedStatus.AVAILABLE], // Use the enum values
      default: BedStatus.AVAILABLE, // Default to available
    },
  },
  { timestamps: true }
);

// Create the Bed model
const Bed = mongoose.model("Bed", bedSchema);

module.exports = Bed;
