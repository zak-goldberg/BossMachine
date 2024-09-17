const express = require('express');

// Create meetingsRouter
const meetingsRouter = express.Router();

// Create a new stream to write to file in this directory
const fs = require('fs');
const path = require('path');
const meetingsLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'meetings-logs.txt'));

// Require in morgan
const morgan = require('morgan');
meetingsRouter.use(morgan('common', { stream: meetingsLogStream }));

// Import route factories
const { getAllFactory
    , postFactory
    , checkIfValidItem 
    , putFactory 
    , deleteFactory } 
    = require('./route-factories.js');

// GET /api/meetings to get an array of all meetings.
meetingsRouter.get('/', getAllFactory('meetings'));

// POST /api/meetings to create a new meeting and save it to the database.
meetingsRouter.post('/', postFactory('meetings'));

// DELETE /api/meetings to delete _all_ meetings from the database.
meetingsRouter.delete('/', deleteFactory('meetings', true));

module.exports = meetingsRouter;