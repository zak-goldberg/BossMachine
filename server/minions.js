const express = require('express');

// Create minionsRouter
const minionsRouter = express.Router();

// Create a new stream to write to file in this directory
const fs = require('fs');
const path = require('path');
const minionLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'minion-logs.txt'), { flags: 'a' });

// Require in morgan
const morgan = require('morgan');
minionsRouter.use(morgan('common', { stream: minionLogStream }));

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
  minionLogStream.write(`newMinionPayload: ${JSON.stringify(newMinionPayload)} \n`);
  try {
    const newMinion = addToDatabase('minions', newMinionPayload);
    minionLogStream.write(`newMinion: ${JSON.stringify(newMinion)} \n`);
    res.status(201).send(newMinion);
  } catch(err) {
    return next(err);
  }
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
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
  } catch(err){
    return next(err);
  }
});

// DELETE /api/minions/:minionId to delete a single minion by id.
minionsRouter.delete('/:minionId', (req, res, next) => {
  const deletedMinion = deleteFromDatabasebyId('minions', req.minionId);
  if (deletedMinion) {
    res.status(204).send();
  } else {
    next(new Error('Please enter a valid minionId'));
  }
});

// Generic error handler
minionsRouter.use((err, req, res, next) => {
  minionLogStream.write(`${err.name}: ${err.message} \n${err.fileName}: ${err.lineNumber} \n`);
  res.status(404).send(err.message);
});

module.exports = minionsRouter;