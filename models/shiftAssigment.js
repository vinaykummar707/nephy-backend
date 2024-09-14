const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftAssignmentSchema = new Schema({
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  visited: {
    type: Boolean,
    default: false  // Track if the patient has visited on that day
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const ShiftAssignment = mongoose.model('ShiftAssignment', shiftAssignmentSchema);
module.exports = ShiftAssignment;
