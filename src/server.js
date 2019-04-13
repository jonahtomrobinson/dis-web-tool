const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oagr3dglwp1CJEYp356',
  issuer: 'https://dev-715478.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(__dirname + '/assets/css'));

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let Post = database.define('posts', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
})

// Define our Technology model
// id, createdAt, and updatedAt are added by sequelize automatically
let Tech = database.define('technology', {
    logo: Sequelize.BLOB,
    name: Sequelize.STRING,
    cost: Sequelize.STRING,
    purpose: Sequelize.STRING,
    description: Sequelize.STRING
  })

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Post model
let postResource = epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id']
})

// Create the dynamic REST resource for our Tech model
let techResource = epilogue.resource({
    model: Tech,
    endpoints: ['/techs', '/techs/:id']
  })

// Resets the database and launches the express app on :8081
database
  .sync({ force: true })
    app.listen(8081, () => {
    console.log('listening to port localhost:8081')
    
  })