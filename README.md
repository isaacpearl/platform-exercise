# Isaac Pearl - Fender Digital Platform Engineering Challenge

## Solution

### Overview
I implemented a JWT-based solution to this challenge. My approach in solving the problem was to use simple tooling in order to put my focus into expressive code and the approximation a production-level application, rather than getting bogged down in the details of using a more heavy-handed toolkit. To that end, I used SQLite as my database, and Node.js/Express.js to handle the serverside code. This solution is very easy to set up and run locally, and could be deployed to Heroku with almost no configuration outside of connecting the deployment pipeline to the GitHub repository.

Each endpoint is handled in its own router module (contained in the `routes/` directory), with only a couple functions shared between modules. The `index.js` file handles the top-level routing and server/db initialization. 

More broadly, I prefer to use a functional programming style, and I strove to implement functions as "purely" as possible when practical. The database is stored as a file in the local directory, and it gets initialized by a short Node.js script when the server starts up.


### API
TODO: add API documentation here

### Database (SQLite) Tables 
#### users
Columns:
- `id` (primary key integer, autoincrements as rows are added)
- `email` (required unique string)
- `password` (required string)
- `name` (required string)

#### blacklist
Columns:
- `token` (primary key string)
- `expiration_date` (integer, a unix timestamp with accuracy measured in seconds)
- `user_id` (integer, foreign key into the `users` table)

### Tools
- `Node.js`
- `Express.js`
- `body-parser`
- `Sqlite`
- `jsonwebtoken`
- `nodemon`
- `Axios` (for testing)

## Setup / How to start
1. `git clone git@github.com:isaacpearl/platform-exercise.git`
2. From the top-level directory, run `npm install` to download all required modules
3. In the same directory, run `npm run start` to start up the server (defaults to port `3000`) and initialize the database (you can also use `npm run start-dev` to start with `nodemon` - a helpful utility that automatically restarts the server when code changes are written to file)

## Tests (WIP)
- Make sure to delete the `fender_platform_exercise_data.db` file before running tests (if it already exists)
- Start/restart the server according to the instructions in the `Setup/How to start` section
- Run `npm run tests`

## TODOs
- Switch out SQLite for PostgreSQL
- Clean out blacklist table on time interval (checking for expired tokens and removing from the database)
- Implement full input validation/type checking
- Modularize DB operations such that swapping out SQLite for PostgreSQL is as low-touch as possible 
- Build out unit testing with better organization/coverage, and/or use framework such as Jest to standardize
- 
