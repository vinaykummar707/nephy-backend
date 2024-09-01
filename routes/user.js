// routes/user.js
const User = require("../models/user");
const DialysisUnit = require("../models/dialysisUnits");
const DialysisUnitAdmin = require("../models/dialysisUnitAdmin");
const checkHospitalAdmin = require("../middleware/checkHospitalAdmin");
const { UserRoles } = require("../utils/enums");

module.exports = async function (fastify, opts) {
  // Route to register a new user
  fastify.post(
    "/dialysis-units/:dialysisUnitId/admin",
    { preHandler: checkHospitalAdmin },
    async (request, reply) => {
      const { dialysisUnitId } = request.params;
      const { email, firstName, lastName, password } = request.body;

      try {
        // Check if the dialysis unit exists
        const dialysisUnit = await DialysisUnit.findById(dialysisUnitId);
        if (!dialysisUnit) {
          return reply.status(404).send({ error: "Dialysis Unit not found" });
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
          message: "Dialysis Unit Admin created and assigned successfully",
          user: newUser,
          dialysisUnitAdmin,
        });
      } catch (error) {
        reply
          .status(500)
          .send({ error: "Internal Server Error", details: error.message });
      }
    }
  );

  fastify.post("/users", async (request, reply) => {
    console.log(request.body, "**********");

    const { email, firstName, lastName, password, role } = request.body;

    if (
      ![
        UserRoles.PATIENT,
        UserRoles.TECHNICIAN,
        UserRoles.DIALYSIS_UNIT_ADMIN,
        UserRoles.HOSPITAL_ADMIN,
      ].includes(role)
    ) {
      reply.status(400).send({ error: "Invalid role" });
    }

    try {
      const newUser = new User({ email, firstName, lastName, password, role });
      await newUser.save();
      reply
        .status(201)
        .send({ message: "User registered successfully", user: newUser });
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  });

  // Route to login a user (basic example, should include proper authentication and security)
  fastify.post("/users/login", async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email, password });
      if (!user) {
        return reply.status(400).send({ error: "Invalid credentials" });
      }
      reply.send({ message: "Login successful", user });
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  });

  // Route to get user details
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }
      reply.send(user);
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  });

};
