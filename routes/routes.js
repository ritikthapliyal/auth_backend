const express = require('express')
const { genPassword } = require('../utils/passwordUtils')
const User = require('../models/userModel')
const router = express.Router()
const passport = require('passport')



router.get('/visits',(req,res)=>{
    console.log(req.session)
    console.log(req.user)
    req.session.viewCount ? req.session.viewCount += 1 : req.session.viewCount = 1
    res.json({viewCount : req.session.viewCount})
})



router.post('/login', passport.authenticate('local', { successRedirect: '/visits', failureRedirect: '/login'}))


router.post('/register',async (req, res) => {

    
    const { password, username} = req.body
    
    if(!username || !password){ res.json({message:"username and password required."}) }

    const {hash,salt} = genPassword(password)

    try{
        const newUser = await User.create({
            username,
            hash,
            salt
        })

        console.log(newUser)
        res.json({message:"User created."})
    }
    catch(err){
        console.log(err)
        res.json({message:"User not created."})
    }

})


module.exports = router;
