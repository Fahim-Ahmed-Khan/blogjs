const express = require('express');
const methodOverride = require('method-override');
const Article = require('./../models/article');
const router = express.Router();

// Middleware to parse request body
router.use(express.urlencoded({ extended: true }));

// Create new article form
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// Edit existing article form
router.get('/edit/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            // If the article doesn't exist, redirect to a suitable page
            res.redirect('/');
        } else {
            // Render the edit page with the article data
            res.render('articles/edit', { article: article });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Update existing article
router.put('/:slug', async (req, res) => {
    try {
        const updatedArticle = await Article.findOneAndUpdate(
            { slug: req.params.slug },
            req.body, // Update with the request body
            { new: true } // Return the updated document
        );
        if (!updatedArticle) {
            res.redirect('/');
        } else {
            res.redirect(`/articles/${updatedArticle.slug}`);
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// View a specific article
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            res.redirect('/');
        } else {
            res.render('articles/show', { article: article });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Delete an article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Save new article
router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    try {
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (error) {
        console.error(error);
        res.render('articles/new', { article: article });
    }
});

// Add method-override middleware to the app instance
router.use(methodOverride('_method'));

module.exports = router;
