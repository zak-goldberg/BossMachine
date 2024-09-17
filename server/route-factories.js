// TO-DO: improve comments
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

// Valid types array
function isValidType(type) {
    const validTypes = ['minions', 'ideas', 'meetings', 'work'];
    return validTypes.includes(type);
}

// GET all factory
function getAllFactory(type) {
    if (isValidType(type)) {
        const getAllItems = (req, res, next) => {
            const allItemsArray = getAllFromDatabase(type);
            res.send(allItemsArray);
        };
        return getAllItems;
    } else {
        return(new Error('Please provide a valid type'));
    }
}

// POST factory
function postFactory(type) {
    if (isValidType(type)) {
        const postNewItem = (req, res, next) => {
            const newItemPayload = req.body;
            try {
                const newItem = addToDatabase(type, newItemPayload);
                res.status(201).send(newItem);
            } catch(err) {
                return next(err);
            }
        };
        return postNewItem;
    } else {
        return(new Error('Please provide a valid type'));
    }
}

// checkIfValidItems factory
function checkIfValidItem (type) {
    if (isValidType(type)) {
        const isValidItem = (req, res, next, id) => {
            const requestedItem = getFromDatabaseById(type, id);
            factoryLogStream.write(`JSON.stringify(requestedItem): ${JSON.stringify(requestedItem)} \n`);
            if (requestedItem) {
              factoryLogStream.write('Made it into the requestedItem if statement. \n');
              req.requestedItemId = id;
              req.requestedItem = requestedItem;
              next();
            } else {
              next(new Error('Please enter a valid idea id.'));
            }
          };
        return isValidItem;
    } else {
        return(new Error('Please provide a valid type'));
    }  
}

// PUT factory
function putFactory (type) {
    if (isValidType(type)) {
        const putItem = (req, res, next) => {
            try {
              const updatedIdea = updateInstanceInDatabase(type, req.body);
              res.send(updatedIdea);
            } catch(err){
              return next(err);
            }
          };
        return putItem;
    } else {
        return(new Error('Please provide a valid type'));
    }  
}

// DELETE factory
function deleteFactory (type, deleteAll) {
    if (isValidType(type) && deleteAll !== true) {
        const deleteItem = (req, res, next) => {
            const deletedItem = deleteFromDatabasebyId(type, req.requestedItemId);
            if (deletedItem) {
              res.status(204).send();
            } else {
              next(new Error('Please enter a valid itemId'));
            }
          };
        return deleteItem;
    } else if (isValidType(type) && deleteAll === true) {
        const deleteAllItems = (req, res, next) => {
            const deletedArray = deleteAllFromDatabase(type);
            if (deletedArray) {
              res.status(204).send();
            } else {
              next(new Error('Delete failed for some reason. Please try again.'));
            }
          };
        return deleteAllItems;        
    }
    else {
        return(new Error('Please provide a valid type'));
    }
}

module.exports.getAllFactory = getAllFactory;
module.exports.postFactory = postFactory;
module.exports.checkIfValidItem = checkIfValidItem;
module.exports.putFactory = putFactory;
module.exports.deleteFactory = deleteFactory;