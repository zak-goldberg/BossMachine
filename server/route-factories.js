// Import database helper functions
const { getAllFromDatabase
    , getFromDatabaseById
    , addToDatabase
    , updateInstanceInDatabase
    , deleteFromDatabasebyId
    , deleteAllFromDatabase } 
    = require('./db.js');

// Create a new stream to write to file in this directory
const fs = require('fs');
const path = require('path');
const factoryLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'factory-logs.txt'));

// Require in morgan
const morgan = require('morgan');

// GET all factory
function getAllFactory(type) {
    const validTypes = ['minions', 'ideas', 'meetings', 'work'];
    if (validTypes.includes(type)) {
        const getAllItems = (req, res, next) => {
            const allItemsArray = getAllFromDatabase(type);
            res.send(allItemsArray);
        };
        return getAllItems;
    } else {
        return(new Error('Please provide a valid type'));
    }
}

module.exports.getAllFactory = getAllFactory;