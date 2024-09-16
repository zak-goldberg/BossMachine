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

// Import route factories
const { getAllFactory
    , postFactory
    , checkIfValidItem 
    , putFactory 
    , deleteFactory } 
    = require('./route-factories.js');

// Import checkMillionDollarIdea middleware function
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');

// GET /api/ideas to get an array of all ideas.
ideasRouter.get('/', getAllFactory('ideas'));

// POST /api/ideas to create a new idea and save it to the database.
// Schema & data types are validated by addToDatabase() function.
// Use checkMillionDollarIdea for value validation
ideasRouter.post('/', checkMillionDollarIdea, postFactory('ideas'));

// Middleware function to check if provided ideasId exists  
ideasRouter.param('ideaId', checkIfValidItem('ideas')); 

// GET /api/ideas/:ideaId to get a single idea by id.
ideasRouter.get('/:ideaId', (req, res, next) => { 
    res.send(req.requestedItem);
  });

// PUT /api/ideas/:ideaId to update a single idea by id.
// Use checkMillionDollarIdea for value validation
ideasRouter.put('/:ideaId', checkMillionDollarIdea, putFactory('ideas'));

// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideasRouter.delete('/:ideaId', deleteFactory('ideas'));

// Generic error handler
const genericErrorHandler = require('./generic-error-handler.js');
ideasRouter.use(genericErrorHandler);

module.exports = ideasRouter;