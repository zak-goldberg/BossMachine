const express = require('express');
const apiRouter = express.Router();

// Import minionsRouter and use it for /api/minions path
const minionsRouter = require('./minions.js');
apiRouter.use('/minions', minionsRouter);

// Import ideasRouter and use it for /api/ideas path
const ideasRouter = require('./ideas.js');
apiRouter.use('/ideas', ideasRouter);

// remember to import and app.use all new routers

module.exports = apiRouter;
