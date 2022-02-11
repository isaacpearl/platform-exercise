# Isaac Pearl - Fender Digital Platform Engineering Challenge

## Solution

### Overview
I implemented a JWT-based solution to this challenge. My approach in solving the problem was to use simple tooling in order to put my focus into expressive code and the approximation a production-level application, rather than getting bogged down in the details of using a more heavy-handed toolkit. To that end, I used SQLite as my database, and Node.js/Express.js to handle the serverside code. This solution is very easy to set up and run locally, and could be deployed to Heroku with almost no configuration outside of connecting the deployment pipeline to the GitHub repository.

Each endpoint is handled in its own router module (contained in the `routes/` directory), with only a couple functions shared between modules. The `index.js` file handles the top-level routing and server/db initialization. User data is stored in a `users` table, and a JWT blacklist (used to implement user logout) is stored in a separate `blacklist` table. 

More broadly, I prefer to use a functional programming style, and I strove to implement functions as "purely" as possible when practical. The database is stored as a file in the local directory, and it gets initialized by a short Node.js script when the server starts up.


### Tools Used
- `Node.js` (backend JS runtime)
- `Express.js` (HTTP routing)
- `body-parser` (utility for parsing JSON body from HTTP requests)
- `sqlite3`/`sqlite` (simple SQL data store/support for `async`/`await` syntax)
- `bcrypt` (for hashing passwords)
- `jsonwebtoken` (for generating JWT objects)
- `nodemon` (for supporting more ergomonic development/speed of iteration)
- `Axios` (for testing)

### API
#### Create a new user
- URI: `/register/`
- Method: `POST`
- Data params:
  - `email` (string, required)
  - `password` (string, required, must contain at least one number and one letter)
  - `name` (string, required)
- Success response
  - Code: `200 OK`
  - Content: 
```
{
    "message": "success",
    "data": {
        "name": "test Guitars",
        "email": "test@guitars.com"
    }
}
```
- Error responses
  - `409` (User already exists with this email address)
  - `400` (Bad request)
- Sample call
```
curl --location --request POST 'http://localhost:3000/api/v1/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Isaac Pearl",
    "email": "isaac@pearl.com",
    "password": "abc123"
}'
```

#### Log in
- URI: `/login/`
- Method: `POST`
- Data params:
  - `email` (string, required)
  - `password` (string, required)
- Success response
  - Code: `200 OK`
  - Content:
```
{
    "success": true,
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGd1aXRhcnMuY29tIiwiaWF0IjoxNjQ0NTYxNTgyLCJleHAiOjE2NDQ1NjE4ODJ9.ZEFAQ0wj8-8oAxbrHgEXKCvxJpgWVAObqMiTTsASwt8"
}
```
- Error response
  - `404` (User not found)
  - `400` (Bad request)
- Sample call
```
curl --location --request POST 'http://localhost:3000/api/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "isaac@pearl.com",
    "password": "abc123"
}'
```

#### Log out
- URI: `/logout/`
- Method: `POST`
- Authentication headers:
```
    {
    'Authorization': `Bearer ${token}`,
    ...
    }
```
- Success response
  - Code: `200 OK`
  - Content:
```
{
    "message": "success",
    "data": {
        "message": "Successfully logged out."
    }
}
 ```
- Error response
  - `403` (User not logged in)
  - `400` (Bad request)
- Sample call
```
curl --location --request POST 'http://localhost:3000/api/v1/logout' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJpc2FhY0BwZWFybC5jb20iLCJpYXQiOjE2NDQ1Njg1MTAsImV4cCI6MTY0NDU3MjExMH0.PdH3NX3g8diy3NnrnkwlH29Qc3PuWivyEGld91uzvL0' \
--data-raw '{
    "email": "fender@guitars.com",
    "password": "def456"
}'
```

#### Retrieve a user's data
- URI: `/users/:id`
- Method: `GET`
- URL params
  - `id` (required)
- Success response
  - Code: `200 OK`
  - Content:
```
{
    "message": "success",
    "data": {
        "id": 3,
        "email": "isaac@pearl.com",
        "name": "Isaac Pearl"
    }
}
```
- Error response
  - `404` (User not found)
  - `403` (Request not authorized)
  - `400`(Bad request)
- Sample call
```
curl --location --request GET 'http://localhost:3000/api/v1/users/3' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJpc2FhY0BwZWFybC5jb20iLCJpYXQiOjE2NDQ1Njg3MTcsImV4cCI6MTY0NDU3MjMxN30.rJ95sPSLloUeoM3NprG3r8gAxjyICIvqnsooQiBaKf8' \
```

#### Update a user's data
- URI: `/users/:id`
- Method: `PUT`
- URL params:
  - `id` (required)
- Data params:
  - `email` (string, optional)
  - `name` (string, optional)
  - TODO: `password` (string, optional)
- Success response:
  - Code: `200 OK`
  - Content:
```
{
    "message": "success",
}
```
- Error response:
  - `404` (User not found)
  - `403` (Request not authorized)
  - `400`(Bad request)
- Sample call:
```
curl --location --request PUT 'http://localhost:3000/api/v1/users/3' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJpc2FhY0BwZWFybC5jb20iLCJpYXQiOjE2NDQ1Njg3MTcsImV4cCI6MTY0NDU3MjMxN30.rJ95sPSLloUeoM3NprG3r8gAxjyICIvqnsooQiBaKf8' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "isaac p"
}'
```

#### Delete a user
- URI: `/users/:id`
- Method: `DELETE`
- URL params:
  - `id` (required)
- Success response:
- Error response:
  - `404` (User not found)
  - `403` (Request not authorized)
  - `400`(Bad request)
- Sample call:
```
curl --location --request DELETE 'http://localhost:3000/api/v1/users/3' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJpc2FhY0BwZWFybC5jb20iLCJpYXQiOjE2NDQ1Njg3MTcsImV4cCI6MTY0NDU3MjMxN30.rJ95sPSLloUeoM3NprG3r8gAxjyICIvqnsooQiBaKf8' \
--header 'Content-Type: application/json' \
```

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

## Setup / How to start
1. `git clone git@github.com:isaacpearl/platform-exercise.git`
2. From the top-level directory, run `npm install` to download all required modules
3. In the same directory, run `npm run start` to start up the server (defaults to port `3000`) and initialize the database (you can also use `npm run start-dev` to start with `nodemon` - a helpful utility that automatically restarts the server when code changes are written to file)

## Tests (WIP)
- Make sure to delete the `fender_platform_exercise_data.db` file before running tests (if it already exists)
- Start/restart the server according to the instructions in the `Setup/How to start` section
- Run `npm run tests`

## TODOs
- Support changing password (w/ rehashing)
- Switch out SQLite for PostgreSQL
- Clean out blacklist table on time interval (checking for expired tokens and removing from the database)
- Implement full input validation/type checking
- Modularize DB operations such that swapping out SQLite for PostgreSQL is as low-touch as possible 
- Build out unit testing with better organization/coverage, and/or use framework such as Jest to standardize
