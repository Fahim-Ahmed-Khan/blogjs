const express = require('express');
const articleRouter = require("./routes/articles");
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override') 
const app = express();

mongoose.connect('mongodb+srv://210899:XEwtdYyvq89S5coV@blog.p11w34w.mongodb.net/');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
// Define your root route to render the index template
app.get('/', async(req, res) => {
    const articles = await Article.find().sort({createdAt:'desc'});

    res.render('articles/index', { articles: articles });
});

// Mount the articleRouter for '/articles' routes
app.use('/articles', articleRouter);

app.listen(3000);
