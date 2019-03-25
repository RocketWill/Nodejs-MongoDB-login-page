const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
            //match user
            User.findOne({email: email})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: "此郵箱尚未註冊"});
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            //將user物件傳至前端
                            return done(null, user);
                        }else{
                            return done(null, false, {message: "密碼錯誤"})
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}