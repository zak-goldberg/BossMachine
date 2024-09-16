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

// Import route factories
const { getAllFactory
  , postFactory
  , checkIfValidItem 
  , putFactory 
  , deleteFactory } 
  = require('./route-factories.js');

// GET /api/minions to get an array of all minions.
minionsRouter.get('/', getAllFactory('minions'));

// POST /api/minions to create a new minion and save it to the database.
// Schema & data types are validated by addToDatabase() function.
minionsRouter.post('/', postFactory('minions'));

// Middleware function to check if provided minionId exists and throw an error if not
minionsRouter.param('minionId', checkIfValidItem('minions')); 

// GET /api/minions/:minionId to get a single minion by id.
minionsRouter.get('/:minionId', (req, res, next) => { 
  res.send(req.requestedItem);
});

// PUT /api/minions/:minionId to update a single minion by id.
minionsRouter.put('/:minionId', putFactory('minions'));

// DELETE /api/minions/:minionId to delete a single minion by id.
minionsRouter.delete('/:minionId', deleteFactory('minions'));

// Generic error handler
const genericErrorHandler = require('./generic-error-handler.js');
minionsRouter.use(genericErrorHandler);

module.exports = minionsRouter;