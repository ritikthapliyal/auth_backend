const passport = require('passport')
const User = require('../models/userModel')
const { validatePassword } = require('../utils/passwordUtils')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy


const verifyCallbackLocal = async (username, password, done)=>{

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



const verifyCallbackGoogle = async (accessToken,refreshToken,profile,done)=>{
    try{                                             
        let user = await User.findOne({googleId : profile.id})
        if(!user){
            user = await User.create({
                username: profile.displayName,
                hash : "",
                salt : "",
                googleId: profile.id,
                isAdmin: false,
                email: profile.emails[0].value
            })
        }

        done(null,user)

    }catch(err){
        console.log(err)
        return done(err)
    }
}


const googleCreds = {
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}


const localStrategy = new LocalStrategy(verifyCallbackLocal)
const googleStrategy = new GoogleStrategy(googleCreds,verifyCallbackGoogle)


passport.use(localStrategy)
passport.use(googleStrategy)

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
