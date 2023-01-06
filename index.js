const express = require('express');
const passport = require('passport');
const articleRouter = require('./routes/articles');
const rateLimit = require('express-rate-limit')
require('dotenv').config();
const Article = require('./models/article')
const methodOverride = require('method-override')
const logger = require('./logging/logger')
const helmet = require('helmet')
const app = express();
const  userRoute = require('./routes/user')
const bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// Apply the rate limiting middleware to all requests
app.use(limiter)

//Security middleware
app.use(helmet())

app.use(passport.initialize());
// app.use(passport.session());


const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI;

// connect to mongodb
function connectToMongoDB() {
    mongoose.connect(MONGODB_URI);
    
    mongoose.connection.on('connected', () => {
        logger.info('Connected to MongoDB successfully');
    });
    
    mongoose.connection.on('error', (err) => {
        logger.error(err)
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

app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`)
})