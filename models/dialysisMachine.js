const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DialysisMachineSchema = new Schema(
  {
    machineNo: {
      type: Number, // Change from string to number
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "maintenance", "out-of-order"],
      default: "available",
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    dialysisUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DialysisUnit",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DialysisMachine", DialysisMachineSchema);
