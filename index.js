require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const morgan = require('morgan');

const app = express();
app.use(cookieSession({
  name: 'session',
  secret: process.env.COOKIE_SECRET,
  // Cookie Options
  maxAge: 6 * 60 * 60 * 1000 // 6 hours
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const usersRouter = require('./routes/usersRoutes');
const gamesRouter = require('./routes/gamesRoutes');
const playsRouter = require('./routes/playsRoutes');
const scoresRouter = require('./routes/scoresRoutes');
const decksRouter = require('./routes/decksRoutes');

app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/plays', playsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/decks', decksRouter);

// Handle 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send({ msg: 'No resource or page found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});
