// models/dialysisUnit.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const dialysisUnitSchema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Hospital ID is required']
  },
  unitName: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10,15}$/, 'Please enter a valid phone number']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  }
});

// Create the Dialysis Unit model
const DialysisUnit = mongoose.model('DialysisUnit', dialysisUnitSchema);

module.exports = DialysisUnit;
