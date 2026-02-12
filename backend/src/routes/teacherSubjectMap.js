const express = require('express');
const router = express.Router();
const {
  getAllTeacherSubjectMap,
  getTeacherSubjectMapById,
  createTeacherSubjectMap,
  updateTeacherSubjectMap,
  deleteTeacherSubjectMap
} = require('../controllers/teacherSubjectMapController');

router.get('/', getAllTeacherSubjectMap);
router.get('/:id', getTeacherSubjectMapById);
router.post('/', createTeacherSubjectMap);
router.put('/:id', updateTeacherSubjectMap);
router.delete('/:id', deleteTeacherSubjectMap);

module.exports = router;
