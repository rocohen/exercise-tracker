const router = require('express').Router();
const {
  getUsers,
  createExercise,
  getUserLogs,
  createUser,
} = require('../controllers/userController');

router.get('/', getUsers);

router.post('/', createUser);

router.post('/:_id/exercises', createExercise);

router.get('/:_id/logs', getUserLogs);

module.exports = router;
