const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShiftSchema = new Schema({
  name: {
    type: String,
    required: true, // Shift name like 'morning', 'evening', 'afternoon', etc.
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital', // Reference to the hospital where the shift is created
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // The hospital admin who created this shift
    required: true,
  },
  patients: [{
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient', // Reference to patients assigned to this shift
    },
    visited: {
      type: Boolean,
      default: false, // Whether the patient has visited the shift on that day
    },
  }],
  isActive: {
    type: Boolean,
    default: true, // To mark whether the shift is active or not
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Shift', ShiftSchema);
