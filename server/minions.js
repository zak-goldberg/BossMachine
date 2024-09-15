const express = require('express');

// Create minionsRouter
const minionsRouter = express.Router();

// Create a new stream to write to file in this directory
const fs = require('fs');
const path = require('path');
const minionLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'minion-logs.txt'), { flags: 'a' });

// Require in morgan
const morgan = require('morgan');

// Create a custom token for response body
morgan.token('response-body', function (req, res) {
  if (res.body) {
    return JSON.stringify(res.body);
  } else {
    return '-';
  }
});

// Create a custom format string that includes the response body
const logFormat = ':method :url :status :response-time ms - :res[content-length] :response-body';

// Use the custom format in morgan
const logger = morgan(logFormat, { stream: minionLogStream });

// Middleware to capture the response body
function captureResponseBody(req, res, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk);
    }
    res.body = Buffer.concat(chunks).toString('utf8');
    oldEnd.apply(res, arguments);
  };

  next();
}

// Configure minionsRouter to capture response body and log each response
minionsRouter.use(captureResponseBody);
minionsRouter.use(logger);

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
  res.status(400).res.send(err.message);
});

module.exports = minionsRouter;