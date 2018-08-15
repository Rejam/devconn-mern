const router = require("express").Router();
const passport = require("passport");

const handleAuthRoute = require("./handleAuthRoute");

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
router.post("/register", handleAuthRoute.register);

/**
 * @route POST api/auth/login
 * @desc Login user / returning JWT token
 * @access Public
 */
router.post("/login", handleAuthRoute.login);

/** Test jwt and private route
 * @route GET api/auth/current
 * @desc Return current user
 * @access Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json(req.user)
);
module.exports = router;
