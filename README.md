# Boss Machine Project
My solution to the Codecademy Boss Machine project. This repo only includes the files I touched, not the code provided by Codecademy.

## Project Overview
[From Codecademy](https://www.codecademy.com/journeys/back-end-engineer/paths/becj-22-back-end-development/tracks/becp-22-build-a-back-end-with-express-js/modules/wdcp-22-boss-machine-0c8ce2d6-418b-487f-857f-49771b21894a/informationals/bapi-p4-boss-machine):
> In this project, you will create an entire API to serve information to a Boss Machine, a unique management application for today’s most accomplished (evil) entrepreneurs. You will create routes to manage your ‘minions’, your brilliant ‘million dollar ideas’, and to handle all the annoying meetings that keep getting added to your busy schedule.

## Learning Goals:
- Practice using **Node.JS**
- Practice creating routers and writing routes in **Express.JS**
- Practice writing **factory functions**:
  - This wasn't in the spec but the callback functions for GET, POST, PUT, and DELETE routes were the same across the /api/meetings, /api/minions, and /api/ideas routes, so I thought it would be a good oppourtunity to practice this.
- Practice using **git**: branching, PRs, merging, etc.

## Roadblocks & Learnings:
1. \[Roadblock\] Some tests in the test file provided by CodeAcademy required some troubleshooting and updating the test script: more details [here](https://discuss.codecademy.com/t/boss-machine-post-api-meetings-test-failures-fix/840420).
2. \[Learning\] In the below snippet, `app` is an Express app. `router1` is mounted to `app` for the path `/api/stuff/:stuffId`. A GET route is registered to `router1` for `/`. If a call is made to `GET /api/stuff/:stuffId`, a `.param('stuffId', ...)` call would get executed for `app` but not `router1` because `router1` is not "aware" of the `stuffId` parameter since the request is routed from `app`. I made a false assumption that `router1.param('stuffId', ...)` would get invoked in this scenario which caused me a lot of pain and troubleshooting time... 🤦🏻
``` JS
const express = require('express');
const app = express();
const router1 = express.Router();

app.use('/api/stuff/:stuffId', router1);

// Below line WILL get invoked for GET /api/stuff/:stuffId/ call
app.param('stuffId', callbackFn1);

// Below line WILL NOT get invoked for GET /api/stuff/:stuffId/ call
router1.param('stuffId', callbackFn2);

router1.get('/', callbackFn3);
```

## To-Dos:
1. I left a branch open called `work` with some code to solve for the "Bonus" section of this project with the work related routes. I decided to time-box the project, move onto the next unit, and come back to this "tech debt" when I have more time.
  - Completed: 
    - Create work.js file and register all relevant routes using the factory functions.
  - Upcoming:
    - Further modularize the .param() middleware functions into a seperate file and add into api.js to account for the scenario described in [Roadblocks & Learnings](#roadblocks--learnings) #2 above.
    - Update validation to account for edge cases I didn't consider.