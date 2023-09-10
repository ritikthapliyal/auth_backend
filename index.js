const express = require('express')

//This line will read the .env file and load its contents into the process.env object, making the defined environment variables accessible
require('dotenv').config()


const app = express()
app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
})