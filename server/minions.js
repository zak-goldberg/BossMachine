const express = require('express');
const minionsRouter = express.Router();

// Import database helper functions
const { getAllFromDatabase
    , getFromDatabaseById
    , addToDatabase
    , updateInstanceInDatabase
    , deleteFromDatabasebyId
    , deleteAllFromDatabase } 
    = require('./db.js');

// GET /api/minions to get an array of all minions.
minionsRouter.get('/', (req, res, next) => {
  const minionsArray = getAllFromDatabase('minions');
  res.send(minionsArray);
});

// POST /api/minions to create a new minion and save it to the database.
// Schema & data types are validated by addToDatabase() function.
minionsRouter.post('/', (req, res, next) => {
  const newMinionPayload = req.body;
  try {
    const newMinion = addToDatabase('minions', newMinionPayload);
  } catch(err) {
    return next(err);
  }
  res.send(newMinion);
});

// Middleware function to check if provided minionId exists and throw an error if not
minionsRouter.param('minionId', (req, res, next, id) => {
  const requestedMinion = getFromDatabaseById('minions', id);
  if (requestedMinion) {
    req.minionId = id;
    req.requestedMinion = requestedMinion;
    next();
  } else {
    next(new Error('Please enter a valid minion id.'));
  }
}); 

// GET /api/minions/:minionId to get a single minion by id.
minionsRouter.get('/:minionId', (req, res, next) => { 
  res.send(req.requestedMinion);
});

// PUT /api/minions/:minionId to update a single minion by id.
minionsRouter.put('/:minionId', (req, res, next) => {
  try {
    const updatedMinion = updateInstanceInDatabase('minions', req.requestedMinion);
  } catch(err){
    return next(err);
  }
  res.send(updatedMinion);
});

// DELETE /api/minions/:minionId to delete a single minion by id.

// Generic error handler
app.use((err, req, res, next) => {
  res.status(400).res.send(err.message);
});

module.exports = minionsRouter;