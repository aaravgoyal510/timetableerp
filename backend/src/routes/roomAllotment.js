const express = require('express');
const router = express.Router();
const {
  getAllRoomAllotments,
  getRoomAllotmentById,
  createRoomAllotment,
  updateRoomAllotment,
  deleteRoomAllotment
} = require('../controllers/roomAllotmentController');

router.get('/', getAllRoomAllotments);
router.get('/:id', getRoomAllotmentById);
router.post('/', createRoomAllotment);
router.put('/:id', updateRoomAllotment);
router.delete('/:id', deleteRoomAllotment);

module.exports = router;
