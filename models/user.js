// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { UserRoles } = require('../utils/enums'); // Assuming enums are in utils/enums.js
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	role: {
		type: String,
		enum: [
			UserRoles.PATIENT,
			UserRoles.TECHNICIAN,
			UserRoles.DIALYSIS_UNIT_ADMIN,
			UserRoles.HOSPITAL_ADMIN,
		],
		required: [true, 'Role is required'],
	},
});
// Hash the password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Exclude password from JSON output
userSchema.set('toJSON', {
	transform: function (doc, ret, options) {
		delete ret.password;
		return ret;
	},
});
// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
