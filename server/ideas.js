const express = require('express');

// Create ideasRouter
const ideasRouter = express.Router();

// Create a new stream to write to file in this directory
const fs = require('fs');
const path = require('path');
const ideasLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'ideas-logs.txt'));

// Require in morgan
const morgan = require('morgan');
ideasRouter.use(morgan('common', { stream: ideasLogStream }));

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
ideasRouter.use((err, req, res, next) => {
    ideasLogStream.write(`${err.name}: ${err.message} \n${err.fileName}: ${err.lineNumber} \n`);
    res.status(404).send(err.message);
  });

module.exports = ideasRouter;