const router = require("express").Router();
const passport = require("passport");

const handlePostRoute = require("./handlePostRoutes");
/**
 * @route POST api/posts
 * @desc create Post
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  handlePostRoute.addPost()
);

module.exports = router;
