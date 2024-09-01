// models/hospital.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{5,6}$/, "Please enter a valid pincode"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    googleMapCoords: {
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    logo: {
      type: String, // Assuming logo is stored as a URL or a path to the image
      required: [true, "Logo is required"],
    },
    established: {
      type: Date,
      required: [true, "Established date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Hospital model
const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
