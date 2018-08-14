// Models
const Post = require("../../models/Post");

// validation
const validate = require("../../validation");
const postValidation = require("../../validation/post");
const commentValidation = require("../../validation/comment");

const getAllPosts = () => (req, res) => {
  Post.find({})
    .sort({ date: "desc" })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
};

const getPost = () => (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(_ => res.status(404).json({ error: "Could not find post" }));
};

const addPost = () => (req, res) => {
  const newPost = {
    user: req.user.id,
    text: req.body.text,
    name: req.user.name,
    avatar: req.user.avatar
  };
  const { errors, isValid } = validate(newPost, postValidation);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.create(newPost)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
};

const deletePost = () => (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      console.log(post.user, req.user.id);
      if (post.user.toString() === req.user.id) {
        Post.deleteOne(post)
          .then(_ => res.json({ success: true }))
          .catch(_ => res.status(404).json({ error: "Unable to delete post" }));
      } else {
        return res
          .status(403)
          .json({ errors: "You do not have permission to delete this post" });
      }
    })
    .catch(_ => res.status(404).json({ error: "Could not find post" }));
};

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  deletePost
};
