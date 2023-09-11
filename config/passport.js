const passport = require('passport')
const User = require('../models/userModel')
const { validatePassword } = require('../utils/passwordUtils')
const LocalStrategy = require('passport-local').Strategy

const verifyCallback = async (username, password, done)=>{

    try{
        const user = await User.findOne({username})
    
        //done(error, boolean value to let user access route or not)
        if(!user){ return done(null,false) }
    
        const isValid = validatePassword(password, user.hash, user.salt)
        if(isValid){ return done(null,user) }
        else { return done(null,false) }
    }
    catch(err){
        return done(err)
    }

}

const strategy = new LocalStrategy(verifyCallback)

passport.use(strategy)


passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (userId,done)=>{
    
    try{
        const user = await User.findById(userId)
        return done(null,user)
    }catch(err){
        return done(err)
    }

})
