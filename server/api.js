const express = require('express');
const apiRouter = express.Router();

// Import minionsRouter and use it for /api/minions path
const minionsRouter = require('./minions.js');
apiRouter.use('/api/minions', minionsRouter);

// remember to import and app.use all new routers


module.exports = apiRouter;
