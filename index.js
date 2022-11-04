const express = require('express');
const articleRouter = require('./routes/articles')
require('dotenv').config();
const Article = require('./models/article')
const methodOverride = require('method-override')
const app = express();
const  userRoute = require('./routes/user')
const user = require('./models/user')

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

connectToMongoDB();

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


const PORT = 3000;


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

app.use('/user', userRoute)

app.listen(PORT)