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

/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle
 * @access Public
 */
router.get("/handle/:handle", handleProfileRoute.getProfileByHandle());

/**
 * @route GET api/profile/user/:user_id
 * @desc Get profile by userID
 * @access Public
 */
router.get("/user/:user_id", handleProfileRoute.getProfileById());

/**
 * @route GET api/profile/all
 * @desc Get all user profiles
 * @access Public
 */
router.get("/all", handleProfileRoute.getAllProfiles());

/**
 * @route POST api/profile/experience
 * @desc Post experience
 * @access Private
 */
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  handleProfileRoute.addExperience()
);

/**
 * @route POST api/profile/education
 * @desc Post education
 * @access Private
 */
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  handleProfileRoute.addEducation()
);

module.exports = router;
