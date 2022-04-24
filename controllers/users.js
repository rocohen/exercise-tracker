const usersRouter = require('express').Router()
const User = require('../models/user');
const Exercise = require('../models/exercise');


usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users);
})

usersRouter.post('/', async (req, res) => {
  const { username } = req.body;

  if(username) {
    const newUser = new User({
      username
    })
    await newUser.save(function(err, data) {
      if (err) {
        res.json({ error: 'Could not save user. Try again later'})
      } else {
         const { username, _id } = data;
         res.status(201).json({ _id, username })
      }
    })

  } else {
    res.json({ error: 'username is required'})
  }
})

usersRouter.post('/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  let { description, duration, date } = req.body;
  duration = duration * 1;
  date = new Date(date).toDateString()
    
  date === 'Invalid Date'
    ? date = new Date().toDateString()
    : date 
 
  if(!_id || !description || !duration) {
    
    res.status(400).json({ error: 'Missing Data. Please fill the required fields in the form and try again.'})
  } else {
    const user = await User.findById(_id).exec();
    const exerciseObj = {
      user: _id,
      date,
      duration,
      description
    }
    const newExercise = new Exercise(exerciseObj)

    await newExercise.save();
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      date,
      duration,
      description
    })
  }  
})

usersRouter.get('/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  let { from, to, limit } = req.query;
  isNaN(limit) ? limit = 0 : limit = limit * 1
  const startDate = from && new Date(from).toDateString() !== 'Invalid Date' ? new Date(from).toDateString(): '';
  const endDate = to && new Date(to).toDateString() !== 'Invalid Date' ? new Date(to).toDateString() : '';
  const user = await User.findById(_id).exec();

  if(from && to) {
    const exerclog = await Exercise.find({ user: _id }).where({ date: { $gte: startDate, $lte: endDate }}).limit(limit).sort({ date: -1 })
  const log = exerclog.map(obj => {
      return { description: obj.description, duration: obj.duration, date: new Date(obj.date).toDateString()}
    })
  const logsObj = {
      _id: user._id,
      username: user.username,
      from: startDate,
      to: endDate,
      count: log.length,
      log,
    }
    res.status(200).json(logsObj)
  } else if(from) {
    const exerclog = await Exercise.find({ user: _id }).where({ date: { $gte: startDate }}).limit(limit).sort({ date: -1 })
    const log = exerclog.map(obj => {
      return { description: obj.description, duration: obj.duration, date: new Date(obj.date).toDateString()}
    })
    const logsObj = {
      _id: user._id,
      username: user.username,
      from: startDate,
      count: log.length,
      log,
    }
    res.status(200).json(logsObj)
  } else if(to) {
    const exerclog = await Exercise.find({ user: _id }).where({ date: { $lte: endDate }}).limit(limit).sort({ date: -1 })
    const log = exerclog.map(obj => {
      return { description: obj.description, duration: obj.duration, date: new Date(obj.date).toDateString()}
    })
    const logsObj = {
      _id: user._id,
      username: user.username,
      to: endDate,
      count: log.length,
      log,
    }
    res.status(200).json(logsObj)
  } else {
    const exerclog = await Exercise.find({ user: _id }, 'description duration date').limit(limit).sort({ date: -1 });
    const log = exerclog.map(obj => {
      return { description: obj.description, duration: obj.duration, date: new Date(obj.date).toDateString()}
    })
     const logsObj = {
      _id: user._id,
      username: user.username,
      count: log.length,
      log,
    }
    res.status(200).json(logsObj)
  }
})

module.exports = usersRouter;