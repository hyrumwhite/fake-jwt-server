# fake-jwt-server
a mock jwt server for testing, uses an expiring session and a JWT that updates at a given interval


# Installation
1. Clone the repo or use degit `npx degit github:hyrumwhite/fake-jwt-server`
2. `npm i`

# Running
1. `npm run start` or `node index.js` this will run the server on the default port, 3535

# Arguments
1. port: Number - set the port number. Default: 3535
2. redirectURL: String - the url the server will redirect to after POST /login is called. Default: http://localhost:3000
2. sessionLength: Number - set the length of the login session (in minutes). Default: 30
3. jwtLength: Number - seth the length of time till the JWT is refreshed

`npm run start -- --port=3232 --sessionLength=5 --jwtLength=3 --redirectURL=http://localhost:3001`

# API

## GET /login
Loads a login page with a button that triggers POST /login

## POST /login
Redirects to the `redirectURL` with a `set-cookie` header, setting the session cookie.

## GET /jwt
If the bogus session cookie is present, returns a plain text encoded JWT

## GET /protected-data
If the jwt is valid, returns a 'user' in the form of a JSON object: `{name: John, id: RandomUUID}`

## GET /permissions
If the jwt is valid, returns a permissions object in the form of a JSON object: `{ can_get_data: true }`