const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//user model
const User = require('../models/User');

//Login page
router.get('/login',(req, res) => res.render('login'));

//Register page
router.get('/register',(req, res) => res.render('register'));

//Register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    //res.send('Hello');
    let errors = [];

    //check require fields
    if (!name || !email || !password || !password2){
        errors.push({msg: "請填入必填資訊"});
    }

    //check password match
    if (password !== password2){
        errors.push({msg: "密碼不一致"});
    }

    //check pass length
    if (password.length < 6){
        errors.push({msg: "密碼長度需不小於6位"});
    }

    if (errors.length > 0){
        //console.log(errors);
        res.render('register', {
            errors, 
            name,
            email,
            password,
            password2
        });
    }else{
        //validation passed
        User.findOne({email: email})
            .then(user => {
                if (user){
                    //user exists
                    errors.push({msg: 'Email is already registered'});
                    res.render('register', {
                        errors, 
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        '註冊成功，請登入'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', '登出成功');
    res.redirect('/users/login');
  });

module.exports = router;