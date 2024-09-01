const mongoose = require('mongoose');
const { Schema } = mongoose;

const dialysisUnitAdminSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dialysisUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DialysisUnit',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
});

const DialysisUnitAdmin = mongoose.model('DialysisUnitAdmin', dialysisUnitAdminSchema);

module.exports = DialysisUnitAdmin;
