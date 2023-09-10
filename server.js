const mongoose = require('mongoose')

async function connectAndListen(app){

    try{
        
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })

        console.log("db connected")

        const PORT = process.env.PORT || 5000

        app.listen(PORT,()=>{
            console.log(`listening on port ${PORT}`)
        })
    }
    catch(error){
        console.error("Error connecting to the database:", error.message);
        process.exit(1);
    }
}

module.exports = connectAndListen
