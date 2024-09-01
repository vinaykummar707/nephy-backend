// middleware/checkHospitalAdmin.js
const User = require('../models/user');
const { UserRoles } = require('../utils/enums');

async function checkHospitalAdmin(request, reply, done) {
  const userId = request.headers['x-user-id']; // Example: using a custom header for user ID
  if (!userId) {
    return reply.status(401).send({ error: 'Unauthorized: No user ID provided' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== UserRoles.HOSPITAL_ADMIN) {
      return reply.status(403).send({ error: 'Forbidden: Requires hospitaladmin role' });
    }
    done(); // Proceed if user is a hospitaladmin
  } catch (error) {
    return reply.status(500).send({ error: 'Internal Server Error', details: error.message });
  }
}

module.exports = checkHospitalAdmin;
