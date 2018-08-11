const router = require("express").Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;
const passport = require("passport");

/**
 * @route GET api/auth
 * @desc auth route
 * @access Public
 */
router.get("/", (req, res) => res.json({ msg: "auth route" }));

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // dirty validation
  if (!name || !email || !password)
    return res.status(400).json({ error: "Please complete all fields" });

  // check if email already registerd
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ email: "Email already exists" });

    const avatar = gravatar.url(email, {
      s: "200", // size
      r: "pg", // rating
      d: "mm" // deafult
    });
    const newUser = new User({
      name,
      email,
      password,
      avatar
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.error(err));
      });
    });
  });
});

/**
 * @route POST api/auth/login
 * @desc Login user / returning JWT token
 * @access Public
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ email: "User not found" });
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) res.status(400).json({ password: "Password incorrect" });
      else {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      }
    });
  });
});

/**
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
