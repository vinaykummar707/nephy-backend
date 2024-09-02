// models/dialysisUnit.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const dialysisUnitSchema = new Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Hospital ID is required']
  },
  unitName: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'description is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  isActive: { type: Boolean, default: true },
});

// Create the Dialysis Unit model
const DialysisUnit = mongoose.model('DialysisUnit', dialysisUnitSchema);

module.exports = DialysisUnit;
