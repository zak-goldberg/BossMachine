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
minionsRouter.post('/', (req, res, next) => {
  // TO-DO add validation per the minion schema (generic validation middleware in apiRouter?)
  const newMinionPayload = req.body;
  const newMinion = addToDatabase('minions', newMinionPayload);
  res.send(newMinion);
});

// GET /api/minions/:minionId to get a single minion by id.
// PUT /api/minions/:minionId to update a single minion by id.
// DELETE /api/minions/:minionId to delete a single minion by id.

module.exports = minionsRouter;