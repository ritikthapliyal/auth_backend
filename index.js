const express = require('express')
const session = require('express-session')
const MongoStore = require("connect-mongo")
const connectAndListen  = require('./server')


//This line will read the .env file and load its contents into the process.env object, making the defined environment variables accessible
require('dotenv').config()

const app = express()



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
        maxAge: 1000 * 60 * 2
      }
    })
)


app.get('/',(req,res)=>{

    req.session.viewCount ? req.session.viewCount += 1 : req.session.viewCount = 1

    res.json({viewCount : req.session.viewCount})

})


connectAndListen(app)