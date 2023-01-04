const express = require('express');
const passport = require('passport')
const articleController = require('../controllers/article_controller')
const router = express.Router();

require('../authentication/auth') 

router.get('/new', passport.authenticate('jwt', { session: false }) , articleController.getNewArticle )


router.get('/edit/:id', passport.authenticate('jwt', { session: false }) , articleController.getArticleById )

router.get('/:slug', articleController.getArticleBySlug )

router.post('/', articleController.createNewArticle , articleController.saveArticleAndRedirect('new'))

router.put('/:id', passport.authenticate('jwt', { session: false }) , articleController.updateArticle , articleController.saveArticleAndRedirect('edit'))


router.delete('/:id', passport.authenticate('jwt', { session: false }) , articleController.deleteArticle )





module.exports = router;