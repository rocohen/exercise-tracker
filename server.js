require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/users');
const mongoose = require('mongoose');

const DB = process.env.MONGO_URI;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch((err) => {
    console.error('Error connecting to Mongo', err);
  });


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use('/', express.static(__dirname + '/views'));
app.use('/api/users', usersRouter);



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
