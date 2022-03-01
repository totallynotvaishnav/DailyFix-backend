const Writings = require('../models/writings');
const Users = require('../models/users');
const { marked } = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

exports.getWritings = async (req, res) => {
    console.log(req.userId);
    const allWritings = await Writings.fetchPostByUserId(req.userId);

    res.status(200).json({
        posts: allWritings,
    });
};

exports.getWritingsById = async (req, res) => {
    const writingID = req.params.writingID;
    const post = await Writings.fetchPostById(writingID);

    if (!post) {
        return res.status(404).json({
            message: 'No posts found',
        });
    }
    res.status(200).json({
        message: 'post fetched successfully',
        post: post,
    });
};

exports.createWriting = async (req, res) => {
    const { content } = req.body;
    const authorId = req.userId;
    const sanitizedContent = dompurify.sanitize(marked(content));
    const newWriting = new Writings(authorId, sanitizedContent);

    const createdWriting = await newWriting.save();
    res.status(201).json({
        message: 'New diary entry created successfully!',
        post: {
            ...createdWriting,
        },
    });
};

exports.deletePost = async (req, res) => {
    const writingId = req.params.writingID;
    // console.log(writingId);
    // const authorId = req.body.authorId;
    // if (authorId !== req.userId) {
    //     return res.status(403).json({
    //         message: 'Not authorized to deleted this post',
    //     });
    // }

    await Writings.deletePost(writingId);
    res.status(201).json({
        message: 'Writing deleted successfully!',
    });
};
