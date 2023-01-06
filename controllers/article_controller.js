const Article = require('./../models/article')
const methodOverride = require('method-override')
const express = require('express');


const app = express();


app.use(methodOverride('_method'))




// async function checkOwner (req,res,next) {
//     if (req.user == null) {
//         res.status(403)
//         res.send('You need to be a user')
//     }
//     if (req.user.role) {
        
//     }
// }

function getNewArticle (req, res) {
    res.render('articles/new', { article: new Article() })
}

async function getArticleById (req, res) {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
}

async function getArticleBySlug (req, res) {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
}

async function createNewArticle (req, res, next) {
    req.article = new Article()
    next()
}

async function updateArticle (req, res, next) {
    req.article = await Article.findById(req.params.id)
    next()
}

async function deleteArticle (req, res) {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
}

function deleteArticleByID(req, res) {
    const id = req.params.id
    Article.findByIdAndRemove(id)
        .then(book => {
            res.status(200).send(book)
            res.redirect('/')
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}


function saveArticleAndRedirect(path) {
    return async (req, res) => {
            let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
            article.tags = req.body.tags
            article.author = req.body.author
            // article.read_count = function WordCount(mark) { 
            //     return str.split(" ").length;
            //   }
        try {
            article = await article.save()   
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            res.render(`articles/${path}`, { article: article })
            console.log(error)
        }
    }
}


module.exports = {
    getNewArticle,
    getArticleById,
    getArticleBySlug,
    createNewArticle,
    updateArticle,
    deleteArticle,
    saveArticleAndRedirect,
    deleteArticleByID
}