const express = require('express');
const router = express.Router();
const {
  getAllStaffDeptMaps,
  getStaffDeptMapById,
  createStaffDeptMap,
  updateStaffDeptMap,
  deleteStaffDeptMap
} = require('../controllers/staffDeptMapController');

router.get('/', getAllStaffDeptMaps);
router.get('/:id', getStaffDeptMapById);
router.post('/', createStaffDeptMap);
router.put('/:id', updateStaffDeptMap);
router.delete('/:id', deleteStaffDeptMap);

module.exports = router;
