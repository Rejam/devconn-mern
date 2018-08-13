const router = require("express").Router();
const passport = require("passport");

const handleProfileRoute = require("./handleProfileRoute");

/**
 * @route GET api/profile
 * @desc get current user profile
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  handleProfileRoute.getCurrentProfile()
);

/**
 * @route POST api/profile
 * @desc Create/Update user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  handleProfileRoute.updateProfile()
);
module.exports = router;
