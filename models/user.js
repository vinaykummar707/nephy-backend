// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { UserRoles } = require('../utils/enums'); // Assuming enums are in utils/enums.js

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: [
      UserRoles.PATIENT,
      UserRoles.TECHNICIAN,
      UserRoles.DIALYSIS_UNIT_ADMIN,
      UserRoles.HOSPITAL_ADMIN
    ],
    required: [true, 'Role is required']
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
