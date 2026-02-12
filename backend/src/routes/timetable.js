const express = require('express');
const router = express.Router();
const {
  getAllTimetables,
  getTimetableById,
  getTimetableByClass,
  createTimetable,
  updateTimetable,
  deleteTimetable
} = require('../controllers/timetableController');

router.get('/', getAllTimetables);
router.get('/:id', getTimetableById);
router.get('/class/:classId', getTimetableByClass);
router.post('/', createTimetable);
router.put('/:id', updateTimetable);
router.delete('/:id', deleteTimetable);

module.exports = router;
