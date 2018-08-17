// Models
const Post = require("../../models/Post");

// validation
const Joi = require("joi");
const postValidation = require("../../validation/post");
const commentValidation = require("../../validation/comment");

const getAllPosts = (req, res) => {
  Post.find({})
    .sort({ date: "desc" })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
};

const getPost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(_ => res.status(404).json({ error: "Could not find post" }));
};

const addPost = (req, res) => {
  const newPost = {
    user: req.user.id,
    text: req.body.text,
    name: req.user.name,
    avatar: req.user.avatar
  };
  Joi.validate(newPost, postValidation, { abortEarly: false })
    .then(() => {
      Post.create(newPost)
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err));
    })
    .catch(error => error.details.map(err => err.message));
};

const deletePost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.user.toString() !== req.user.id)
        return res
          .status(403)
          .json({ errors: "You do not have permission to delete this post" });

      Post.deleteOne(post)
        .then(_ => res.json({ success: true }))
        .catch(_ => res.status(404).json({ error: "Unable to delete post" }));
    })
    .catch(_ => res.status(404).json({ error: "Could not find post" }));
};

const likePost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      const alreadyLiked = post.likes.some(id => id.toString() === req.user.id);
      if (alreadyLiked)
        return res
          .status(403)
          .json({ error: "User has already liked this post" });
      post.likes = [...post.likes, req.user.id];
      post
        .save()
        .then(post => res.json(post))
        .catch(_ => res.status(404).json({ error: "Unable to save post" }));
    })
    .catch(_ => res.status(404).json({ error: "Unable to find post" }));
};

const unlikePost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      const alreadyLiked = post.likes.some(id => id.toString() === req.user.id);
      if (!alreadyLiked)
        return res.status(403).json({ error: "User has not liked this post" });

      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      post
        .save()
        .then(post => res.json(post))
        .catch(_ => res.status(404).json({ error: "Unable to save post" }));
    })
    .catch(_ => res.status(404).json({ error: "Could not find post" }));
};

const addComment = (req, res) => {
  // Create new comment
  const newComment = {
    user: req.user.id,
    text: req.body.text,
    name: req.user.name,
    avatar: req.user.avatar
  };

  // validate comment
  Joi.validate(newComment, commentValidation)
    .then(() => {
      Post.findById(req.params.id)
        .then(post => {
          post.comments = [newComment, ...post.comments];
          post
            .save()
            .then(post => res.json(post))
            .catch(_ =>
              res.status(404).json({ error: "Unable to save comment" })
            );
        })
        .catch(_ => res.status(404).json({ error: "Unable to find post" }));
    })
    .catch(error => error.details.map(err => err.message));
};

const deleteComment = (req, res) => {
  const { id, comment_id } = req.params;
  Post.findById(id)
    .then(post => {
      const { comments } = post;
      // check if comment exists
      if (!comments.some(c => c._id.toString() === comment_id))
        return res.status(404).json({ error: "Comment not found" });

      // filter comment from post
      post.comments = comments.filter(c => c._id.toString() !== comment_id);
      // save updated post
      post
        .save()
        .then(post => res.json(post))
        .catch(_ => res.status(404).json({ error: "Unable to save post" }));
    })
    .catch(_ => res.status(404).json({ error: "Unable to find post" }));
};

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
};
