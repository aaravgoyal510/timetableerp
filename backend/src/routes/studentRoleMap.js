const express = require('express');
const router = express.Router();
const {
  getAllStudentRoleMap,
  getStudentRoleMapById,
  createStudentRoleMap,
  updateStudentRoleMap,
  deleteStudentRoleMap
} = require('../controllers/studentRoleMapController');

router.get('/', getAllStudentRoleMap);
router.get('/:id', getStudentRoleMapById);
router.post('/', createStudentRoleMap);
router.put('/:id', updateStudentRoleMap);
router.delete('/:id', deleteStudentRoleMap);

module.exports = router;
