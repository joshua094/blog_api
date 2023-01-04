const express = require('express');
const passport = require('passport')
const routers = express.Router();
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const user = require('../models/user')


const app = express()
// app.use(passport.session());


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies

routers.use(bodyParser.json());


function userLogin (req, res) {
    res.render("user/loginroute")
}

function userSignUp (req, res) {
    res.render("user/signuproute")
}

async function signUpSuccess (req, res) {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
}

async function loginVerification (req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error('Username or password is incorrect');
                return next(error);
            }

            req.login(user, { session: false },
                async (error) => {
                    if (error) return next(error);

                    const body = { _id: user._id, email: user.email, password: user.password };
                    //You store the id and email in the payload of the JWT. 
                    // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                    // DO NOT STORE PASSWORDS IN THE JWT!
                    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 3600 } );

                    return res.json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
}


module.exports = {
    userLogin,
    userSignUp,
    signUpSuccess,
    loginVerification
}

