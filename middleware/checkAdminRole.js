const User = require('../models/user');
const { UserRoles } = require('../utils/enums');

async function checkAdminRole(request, reply, done) {
  const userId = request.headers['x-user-id']; // Example: using a custom header for user ID
  if (!userId) {
    return reply.status(401).send({ error: 'Unauthorized: No user ID provided' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || ![UserRoles.HOSPITAL_ADMIN, UserRoles.DIALYSIS_UNIT_ADMIN].includes(user.role)) {
      return reply.status(403).send({ error: 'Forbidden: Requires hospitaladmin or dialysisunitadmin role' });
    }
    done(); // Proceed if user is authorized
  } catch (error) {
    return reply.status(500).send({ error: 'Internal Server Error', details: error.message });
  }
}

module.exports = checkAdminRole;
