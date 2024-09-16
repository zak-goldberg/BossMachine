const express = require('express');

// Create minionsRouter
const ideasRouter = express.Router();

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

// GET /api/ideas to get an array of all ideas.
// POST /api/ideas to create a new idea and save it to the database.
// GET /api/ideas/:ideaId to get a single idea by id.
// PUT /api/ideas/:ideaId to update a single idea by id.
// DELETE /api/ideas/:ideaId to delete a single idea by id.

// Generic error handler
minionsRouter.use((err, req, res, next) => {
    minionLogStream.write(`${err.name}: ${err.message} \n${err.fileName}: ${err.lineNumber} \n`);
    res.status(404).send(err.message);
  });

module.exports = ideasRouter;