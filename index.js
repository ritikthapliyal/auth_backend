const express = require('express')
const session = require('express-session')
const MongoStore = require("connect-mongo")
const connectAndListen  = require('./server')
const passport = require('passport')
const router = require('./routes/routes')
const cors = require('cors')



//This line will read the .env file and load its contents into the process.env object, making the defined environment variables accessible
require('dotenv').config()

const app = express()
app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

const mongoSessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'Sessions', // The name of the collection to store sessions
})


app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: mongoSessionStore, // Use the connect-mongo session store
      cookie:{
        maxAge: 1000 * 60
      }
    })
)



//passport stuff
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())



//router

app.use('/',router)

connectAndListen(app)