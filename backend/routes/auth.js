const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Uttamsignature';
//Route 1:-Create a User using:POST "/api/auth. Doesn't require Auth"
router.post('/createuser', [
    body('name', 'Enter valid name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // If there is error, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email is already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data ={
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign( data,JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }
})
//Route 2:-//Authenicate a user using :POST "api/auth/login" NO login required
    router.post('/login',[
        body('email',"Enter a valid email").isEmail(),
        body('password',"Password cannot be blank").exists(),
    ], async (req,res) =>{
        let success = false;
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error:"please try to Login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error:"please try to Login with correct credentials"})
        }

        const data ={
            user:{
                id:user.id
            }
        }
        const authtoken =  jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken});
    } catch (error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
//Route 3:-Get Logged in User Details using: POST "api/auth/getuser". Login required
router.post('/getUser',fetchuser, async (req,res) => {
try {
    userid  = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
    }
catch (error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
module.exports = router
