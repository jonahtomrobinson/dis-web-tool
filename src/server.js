const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const OktaJwtVerifier = require('@okta/jwt-verifier')
const multer = require('multer')
const upload = multer({dest: 'uploads/' })

// Okta JWTVerifier credientials
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oagr3dglwp1CJEYp356',
  issuer: 'https://dev-715478.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(__dirname + '/assets/css'));

var bla = true

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header. EXCEPT GET REQUESTS.
  if (req.method == 'GET'){
    next()
  }
  else{
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
        .catch(next) // jwt did not verify!*/
    }
})

app.post('/profile', upload.single('image'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    })

// Setup database.
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

/*------------------------------------*\
  Defining models
  id, createdAt, and updatedAt are added by sequelize automatically
\*------------------------------------*/

// Define our Post model
let Post = database.define('posts', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
  })

// Define our Purpose model
let Purpose = database.define('Purpose', {
    text: Sequelize.STRING,
  })

// Define our Technology model
let Tech = database.define('Technology', {
    logo: Sequelize.BLOB,
    name: Sequelize.STRING,
    cost: Sequelize.STRING,  
    source: Sequelize.STRING,
    description: Sequelize.STRING
  })
Purpose.hasOne(Tech, { foreignKey: 'purpose_id' , foreignKeyConstraint: true})

// Define our Event model
let Event = database.define('Event', {
    logo: Sequelize.BLOB,
    name: Sequelize.STRING,
    style: Sequelize.STRING,
    date: Sequelize.DATEONLY,
    num_of_users: Sequelize.INTEGER.UNSIGNED,
    source: Sequelize.STRING,
    location: Sequelize.STRING,
    additional_info: Sequelize.STRING
  })

// Define our Category model
let Category = database.define('Category', {
    text: Sequelize.STRING,
  })

let CategoryEvent = database.define('CategoryEvent')
Event.hasMany(CategoryEvent, { foreignKey: 'event_id' , foreignKeyConstraint: true, onDelete: 'cascade'})
Category.hasMany(CategoryEvent, { foreignKey: 'category_id' , foreignKeyConstraint: true, onDelete: 'cascade'})

/*let EventTechnology = database.define('EventTechnology', {
    event_id: Sequelize.INTEGER,
    technology_id: Sequelize.INTEGER
})*/

let EventTechnology = database.define('EventTechnology')
Event.hasMany(EventTechnology, { foreignKey: 'event_id' , foreignKeyConstraint: true, onDelete: 'cascade'})
Tech.hasMany(EventTechnology, { foreignKey: 'technology_id' , foreignKeyConstraint: true, onDelete: 'cascade'})

  /*------------------------------------*\
  Initialising epilogue 
  Create the dynamic REST resources for models
\*------------------------------------*/

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
  })

// Post model
let postResource = epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id']
  })

// Tech model
let techResource = epilogue.resource({
    model: Tech,
    endpoints: ['/techs', '/techs/:id']
  })

// Event model
let eventResource = epilogue.resource({
    model: Event,
    endpoints: ['/events', '/events/:id']
  })

// Purpose model
let purposeResource = epilogue.resource({
    model: Purpose,
    endpoints: ['/purposes', '/purposes/:id']
  })

// Category model
let categoryResource = epilogue.resource({
    model: Category,
    endpoints: ['/categories', '/categories/:id']
  })

// CategoryEvent model
let categoryEventResource = epilogue.resource({
    model: CategoryEvent,
    endpoints: ['/categoryEvents', '/categoryEvents/:id']
  })

// EventTechnology model
let eventTechnologyResource = epilogue.resource({
    model: EventTechnology,
    endpoints: ['/eventTechnologies', '/eventTechnologies/:id']
  })

  /*------------------------------------*\
  Tesing ORM requests
\*------------------------------------*/

// Resets the database and launches the express app on :8081
database
  //.sync({ force: true })
    app.listen(8081, () => {
    console.log('listening to port localhost:8081')
    
  })



  /*
  database
  .sync({ force: true })
  .then(function() {
    server.listen(function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });*/