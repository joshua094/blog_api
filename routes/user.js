const express = require('express');
const passport = require('passport')
const routers = express.Router();
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const users = require('../controllers/user_controller')

const app = express()
// app.use(passport.session());


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies

routers.use(bodyParser.json());

routers.get('/loginroute', users.userLogin )

routers.get('/signuproute', users.userSignUp )



routers.post(
    '/signup',
    passport.authenticate('signup', { session: false }), users.signUpSuccess
)

routers.post(
    '/login',
    users.loginVerification
);


module.exports = routers;