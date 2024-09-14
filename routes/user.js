// routes/user.js
const User = require('../models/user');
const DialysisUnit = require('../models/dialysisUnit');
const DialysisUnitAdmin = require('../models/dialysisUnitAdmin');
const checkHospitalAdmin = require('../middleware/checkHospitalAdmin');
const { UserRoles } = require('../utils/enums');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

module.exports = async function (fastify, opts) {
	// Route to register a new user
	fastify.post(
		'/dialysis-units/:dialysisUnitId/admin',
		{ preHandler: checkHospitalAdmin },
		async (request, reply) => {
			const { dialysisUnitId } = request.params;
			const { email, firstName, lastName, password } = request.body;

			try {
				// Check if the dialysis unit exists
				const dialysisUnit = await DialysisUnit.findById(dialysisUnitId);
				if (!dialysisUnit) {
					return reply.status(404).send({ error: 'Dialysis Unit not found' });
				}

				// Create the dialysis unit admin user
				const newUser = new User({
					email,
					firstName,
					lastName,
					password,
					role: UserRoles.DIALYSIS_UNIT_ADMIN,
				});

				await newUser.save();

				// Create the association in the DialysisUnitAdmin model
				const dialysisUnitAdmin = new DialysisUnitAdmin({
					userId: newUser._id,
					dialysisUnitId: dialysisUnit._id,
				});

				await dialysisUnitAdmin.save();

				reply.status(201).send({
					message: 'Dialysis Unit Admin created and assigned successfully',
					user: newUser,
					dialysisUnitAdmin,
				});
			} catch (error) {
				reply
					.status(500)
					.send({ error: 'Internal Server Error', details: error.message });
			}
		}
	);

	fastify.post('/users', async (request, reply) => {
		const { email, password, role } = request.body;

		if (
			![
				UserRoles.PATIENT,
				UserRoles.TECHNICIAN,
				UserRoles.DIALYSIS_UNIT_ADMIN,
				UserRoles.HOSPITAL_ADMIN,
			].includes(role)
		) {
			reply.status(400).send({ error: 'Invalid role' });
		}

		try {
			const newUser = new User({ email, password, role });
			await newUser.save();
			reply
				.status(201)
				.send({ message: 'User registered successfully', user: newUser });
		} catch (error) {
			reply
				.status(500)
				.send({ error: 'Internal Server Error', details: error.message });
		}
	});

	// Route to login a user (basic example, should include proper authentication and security)
	fastify.post('/users/login', async (request, reply) => {
		const { email, password } = request.body;

		try {
			// Find the user by email
			const user = await User.findOne({ email }).select('+password'); // Include the password for comparison

			if (!user) {
				return reply.status(401).send({ error: 'Invalid email or password' });
			}

			// Compare the provided password with the stored hash
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return reply.status(401).send({ error: 'Invalid email or password' });
			}

			// Exclude the password field from the response
			user.password = undefined;

			// Send the user details without the password
			reply.send({ message: 'Login successful', user });
		} catch (error) {
			reply
				.status(500)
				.send({ error: 'Internal Server Error', details: error.message });
		}
	});

	// Route to get user details
	fastify.get('/user/:userId', async (request, reply) => {
		const { userId } = request.params;
		
		try {
			const userData = await userService.getUserWithProfileAggregation(userId);
			reply.send({ success: true, data: userData });
		} catch (error) {
			reply.code(404).send({ success: false, message: error.message });
		}
	});
};
