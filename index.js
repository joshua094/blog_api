const express = require('express');
const passport = require('passport');
const express_session = require('express-session')
const articleRouter = require('./routes/articles');
require('dotenv').config();
const Article = require('./models/article')
const methodOverride = require('method-override')
const app = express();
const  userRoute = require('./routes/user')
const user = require('./models/user')
const bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 


app.use(passport.initialize());
// app.use(passport.session());


const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI;

// connect to mongodb
function connectToMongoDB() {
    mongoose.connect(MONGODB_URI);
    
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully');
    });
    
    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB', err);
    })
}

require('./authentication/auth') //Signup and authentication middleware

connectToMongoDB();

app.set('view engine', 'ejs')
app.use(methodOverride('_method'))


const PORT = process.env.PORT || 5000


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

app.use('/articles' , articleRouter)

app.use('/user', userRoute)

app.listen(PORT)