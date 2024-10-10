const express = require('express');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs/dist/bcrypt');
const router = express.Router();
const JWT_SECRET =  "Dkisagood@boy";
// Create a User using : POST  "/api/auth/createuser". Does not require auth
router.post("/createuser",
    [
        body('name','enter a valid name').isLength({min:3}),
        body('email').isEmail(),
        body('password').isLength({min:5}),
    ]
    ,async (req,res)=>{
      // if there are error then return bad request and errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
          
        
        //check weather user already exist with this email
        let user = await User.findOne({email: req.body.email});
        if(user)
        {
          return res.status(400).json({error: "Sorry this user with this email already exists"});
        }
        // genrating bcypt salt
        const salt = await bcrypt.genSalt(10);
        //hashing the password using bcrypt
        secPass = await bcrypt.hash(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
          })

          const data = {
           user: {
           id: user.id
           }
          }
          const authToken = jwt.sign(data,JWT_SECRET);

          res.json({authToken})
        } catch (error) {
          console.error(error.message);
          res.status(500).send("some error occured");
        }
})

module.exports=router;