const express = require('express')
const { genPassword } = require('../utils/passwordUtils')
const User = require('../models/userModel')
const router = express.Router()
const passport = require('passport')
const { isAuth } = require('./authMiddleware')



router.get('/visits', isAuth ,(req,res)=>{
    console.log(req.session)
    console.log(req.user)
    req.session.viewCount ? req.session.viewCount += 1 : req.session.viewCount = 1
    res.json({viewCount : req.session.viewCount})
})

router.post('/login', passport.authenticate('local', { successRedirect: '/visits', failureRedirect: '/login'}))


//GOOGLE AUTH
router.get('/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/google/callback',passport.authenticate('google'),(req,res)=>{

    if(req.user.hash.length < 1 || req.user.salt.length < 1){
        res.redirect(`http://localhost:3000/user_details`)
    }
    else{
        res.redirect('http://localhost:3000/dashboard')
    }
})




//GET CREDENDIALS
router.get('/credentials',isAuth,async (req, res) => {
    try{
        const {username,email} = req.user
        res.status(200).json({username,email})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"internal server error"})
    }
})
//SET CREDENDIALS
router.patch('/credentials',isAuth,async (req, res) => {

    const {password} = req.body
    const {hash,salt} = genPassword(password)

    try{
        const {modifiedCount} = await User.updateOne({_id : req.user._id},{hash,salt})
        
        modifiedCount === 0 ?
            res.status(404).json({ message: 'User not found'})
        :
            res.status(200).json({ message: 'Updated successfull',status:200})
    }
    catch(err){
        console.log(err)
        res.json({message:"Internal server error"})
    }
})





router.post('/register',async (req, res) => {

    
    const { password, username} = req.body
    
    if(!username || !password){ res.json({message:"username and password required."}) }

    const {hash,salt} = genPassword(password)

    try{
        const newUser = await User.create({
            username,
            hash,
            salt,
            googleId: ""
        })

        console.log(newUser)
        res.json({message:"User created."})
    }
    catch(err){
        console.log(err)
        res.json({message:"User not created."})
    }

})
router.get('/logout',(req,res)=>{
    req.logOut(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred during logout.' })
        } else {
            res.status(200).json({ msg: 'User logged out.' })
        }
    })
})


module.exports = router;
