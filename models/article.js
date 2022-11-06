const mongoose = require('mongoose')
const marked = require('marked')
const user = require('../models/user')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const jwt = require('jsonwebtoken')
const { JSDOM } = require('jsdom')
const { authorize } = require('passport')
const dompurify = createDomPurify(new JSDOM().window)
const Str = require('@supercharge/strings')
const readingTime = require('reading-time')

require('dotenv').config()

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
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
    sanitizedHtml: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: "Draft",
        enum: ["Draft", "Published"]
    },
    read_count: {
        type: Number
    },
    reading_time: {
        type: Object
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))

        this.read_count = Str(this.sanitizedHtml).words().length

        this.reading_time = readingTime(this.sanitizedHtml)
    }
    

    next()
})

module.exports = mongoose.model('Article', articleSchema)