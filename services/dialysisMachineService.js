const DialysisMachine = require("../models/dialysisMachine");

// Service to add a single dialysis machine with an incremented machine number
async function addDialysisMachine({ hospitalId, dialysisUnitId }) {
  try {
    // Find the last machine number in the dialysis unit
    const lastMachine = await DialysisMachine.findOne({ hospitalId })
      .sort({ machineNo: -1 })
      .lean();

    let lastMachineNo = 0;
    if (lastMachine) {
      lastMachineNo = lastMachine.machineNo;
    }

    const newMachineNo = lastMachineNo + 1; // Incrementing the machine number

    const newMachineData = {
      machineNo: newMachineNo,
      hospitalId,
      dialysisUnitId,
      isActive: true,
      isOccupied: false,
      status: "available",
    };

    const machine = new DialysisMachine(newMachineData);
    await machine.save();

    return machine;
  } catch (error) {
    throw new Error(error.message);
  }
}
// Service to add multiple dialysis machines
async function addMultipleDialysisMachines({
  hospitalId,
  dialysisUnitId,
  count,
}) {
  try {
    const machines = [];
    for (let i = 0; i < count; i++) {
      const newMachineData = {
        machineNo: `${dialysisUnitId}-${i + 1}`, // Generating machineNo based on dialysisUnitId and index
        hospitalId,
        dialysisUnitId,
        isActive: true,
        isOccupied: false,
        status: "available",
      };
      const machine = new DialysisMachine(newMachineData);
      machines.push(machine);
    }
    await DialysisMachine.insertMany(machines);
    return machines;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Service to get dialysis machines by dialysis unit ID
async function getMachinesByDialysisUnitId(dialysisUnitId) {
  try {
    const machines = await DialysisMachine.find({ dialysisUnitId })
      .populate("dialysisUnitId") // Populate dialysis unit details
      .lean();
    return machines;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  addDialysisMachine,
  addMultipleDialysisMachines,
  getMachinesByDialysisUnitId,
};
