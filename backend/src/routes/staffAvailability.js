const express = require('express');
const router = express.Router();
const {
  getAllStaffAvailability,
  getStaffAvailabilityById,
  createStaffAvailability,
  updateStaffAvailability,
  deleteStaffAvailability
} = require('../controllers/staffAvailabilityController');

router.get('/', getAllStaffAvailability);
router.get('/:id', getStaffAvailabilityById);
router.post('/', createStaffAvailability);
router.put('/:id', updateStaffAvailability);
router.delete('/:id', deleteStaffAvailability);

module.exports = router;
