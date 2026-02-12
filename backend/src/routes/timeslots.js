const express = require('express');
const router = express.Router();
const {
  getAllTimeslots,
  getTimeslotById,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot
} = require('../controllers/timeslotController');

router.get('/', getAllTimeslots);
router.get('/:id', getTimeslotById);
router.post('/', createTimeslot);
router.put('/:id', updateTimeslot);
router.delete('/:id', deleteTimeslot);

module.exports = router;
