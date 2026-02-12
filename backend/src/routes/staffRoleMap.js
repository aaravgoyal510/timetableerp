const express = require('express');
const router = express.Router();
const {
  getAllStaffRoleMap,
  getStaffRoleMapById,
  createStaffRoleMap,
  updateStaffRoleMap,
  deleteStaffRoleMap
} = require('../controllers/staffRoleMapController');

router.get('/', getAllStaffRoleMap);
router.get('/:id', getStaffRoleMapById);
router.post('/', createStaffRoleMap);
router.put('/:id', updateStaffRoleMap);
router.delete('/:id', deleteStaffRoleMap);

module.exports = router;
