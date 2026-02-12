const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectByCode,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

router.get('/', getAllSubjects);
router.get('/:code', getSubjectByCode);
router.post('/', createSubject);
router.put('/:code', updateSubject);
router.delete('/:code', deleteSubject);

module.exports = router;
