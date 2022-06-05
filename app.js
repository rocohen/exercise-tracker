const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/', express.static(__dirname + '/views'));
app.use('/api/users', userRoutes);

app.all('*', (req, res) => {
  res
    .status(404)
    .json({ error: `Can't find ${req.originalUrl} on this server!` });
});

module.exports = app;
