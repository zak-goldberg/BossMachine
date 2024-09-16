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

// Import route factories
const { getAllFactory } = require('./route-factories.js');

// Import checkMillionDollarIdea middleware function
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');

// GET /api/ideas to get an array of all ideas.
ideasRouter.get('/', getAllFactory('ideas'));

// POST /api/ideas to create a new idea and save it to the database.
// Schema & data types are validated by addToDatabase() function.
// Use checkMillionDollarIdea for value validation
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdeaPayload = req.body;
    try {
      const newIdea = addToDatabase('ideas', newIdeaPayload);
      ideasLogStream.write(`newIdea: ${JSON.stringify(newIdea)} \n`);
      res.status(201).send(newIdea);
    } catch(err) {
      return next(err);
    }
  });

// Middleware function to check if provided ideasId exists  
  ideasRouter.param('ideaId', (req, res, next, id) => {
    const requestedIdea = getFromDatabaseById('ideas', id);
    if (requestedIdea) {
      req.ideaId = id;
      req.requestedIdea = requestedIdea;
      next();
    } else {
      next(new Error('Please enter a valid idea id.'));
    }
  }); 

// GET /api/ideas/:ideaId to get a single idea by id.
ideasRouter.get('/:ideaId', (req, res, next) => { 
    res.send(req.requestedIdea);
  });

// PUT /api/ideas/:ideaId to update a single idea by id.
// Use checkMillionDollarIdea for value validation
ideasRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    try {
      const updatedIdea = updateInstanceInDatabase('ideas', req.body);
      res.send(updatedIdea);
    } catch(err){
      return next(err);
    }
  });

// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideasRouter.delete('/:ideaId', (req, res, next) => {
    const deletedIdea = deleteFromDatabasebyId('ideas', req.ideaId);
    if (deletedIdea) {
      res.status(204).send();
    } else {
      next(new Error('Please enter a valid ideaId'));
    }
  });

// Generic error handler
ideasRouter.use((err, req, res, next) => {
    ideasLogStream.write(`${err.name}: ${err.message} \n${err.fileName}: ${err.lineNumber} \n`);
    res.status(404).send(err.message);
  });

module.exports = ideasRouter;