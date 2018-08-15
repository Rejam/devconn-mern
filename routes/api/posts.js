const router = require("express").Router();
const passport = require("passport");

const handlePostRoute = require("./handlePostRoutes");

/**
 * @route GET api/posts
 * @desc Get all Posts
 * @access Public
 */
router.get("/", handlePostRoute.getAllPosts);

/**
 * @route GET api/posts/:id
 * @desc Get a Post
 * @access Public
 */
router.get("/:id", handlePostRoute.getPost);

/**
 * @route POST api/posts
 * @desc create Post
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.addPost
);

/**
 * @route POST api/posts/:id
 * @desc delete a Post
 * @access Private
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.deletePost
);

/**
 * @route POST api/posts/like/:id
 * @desc like a Post
 * @access Private
 */
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.likePost
);

/**
 * @route POST api/posts/unlike/:id
 * @desc unlike a Post
 * @access Private
 */
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.unlikePost
);

/**
 * @route POST api/posts/comment/:id
 * @desc add a Comment to a Post(:id)
 * @access Private
 */
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.addComment
);

/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @desc delete Comment(comment_id) from Post(id)
 * @access Private
 */
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.deleteComment
);

module.exports = router;
