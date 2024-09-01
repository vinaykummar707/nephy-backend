// utils/enums.js

const UserRoles = {
    PATIENT: 'patient',
    TECHNICIAN: 'technician',
    DIALYSIS_UNIT_ADMIN: 'dialysisunitadmin',
    HOSPITAL_ADMIN: 'hospitaladmin'
  };
  
  const BedStatus = {
    OCCUPIED: 'occupied',
    AVAILABLE: 'available'
  };
  
  module.exports = {
    UserRoles,
    BedStatus
  };
  