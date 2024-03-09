const mongoose = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML: {
        type: String,
        required: true
    }
});

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.markdown) {
        // You can modify this part to directly store markdown and sanitize it when needed.
        this.sanitizedHTML = dompurify.sanitize(this.markdown);
    }
    next();
});

// Creating a simple CRUD operation without using 'marked'
articleSchema.statics.createArticle = async function(articleData) {
    try {
        const article = new this(articleData);
        await article.save();
        return article;
    } catch (error) {
        throw new Error('Could not create article');
    }
};

articleSchema.statics.getArticles = async function() {
    try {
        const articles = await this.find();
        return articles;
    } catch (error) {
        throw new Error('Could not fetch articles');
    }
};

articleSchema.statics.getArticleBySlug = async function(slug) {
    try {
        const article = await this.findOne({ slug });
        if (!article) throw new Error('Article not found');
        return article;
    } catch (error) {
        throw new Error('Could not fetch article');
    }
};

articleSchema.statics.updateArticle = async function(slug, updatedData) {
    try {
        const article = await this.findOneAndUpdate({ slug }, updatedData, { new: true });
        if (!article) throw new Error('Article not found');
        return article;
    } catch (error) {
        throw new Error('Could not update article');
    }
};

articleSchema.statics.deleteArticle = async function(slug) {
    try {
        const article = await this.findOneAndDelete({ slug });
        if (!article) throw new Error('Article not found');
        return article;
    } catch (error) {
        throw new Error('Could not delete article');
    }
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
