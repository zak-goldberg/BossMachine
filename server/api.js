const express = require('express');
const apiRouter = express.Router();

// Import minionsRouter and use it for /api/minions
const minionsRouter = require('./minions.js');
apiRouter.use('/minions', minionsRouter);

// Import ideasRouter and use it for /api/ideas
const ideasRouter = require('./ideas.js');
apiRouter.use('/ideas', ideasRouter);

// Import meetingsRouter and use it for /api/meetings
const meetingsRouter = require('./meetings.js');
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;