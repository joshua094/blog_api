const user = require('./models/user')
const Article = require('./../models/article')


async function checkOwner (req,res,next) {
    if (req.user == null) {
        res.status(403)
        res.send('You need to be a user')
    }
    if (req.user.role) {
        
    }
}

function newArticle(req, res) {
    res.render('articles/new', { article: new Article() })
}

module.exports = {
    newArticle
}