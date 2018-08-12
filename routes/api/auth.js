const router = require("express").Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secretOrKey = require("../../config/keys").secretOrKey;

// Input validation
const validateRegisterData = require("../../validation/register");
const validateLoginData = require("../../validation/login");

// User model
const User = require("../../models/User");

/**
 * @route GET api/auth
 * @desc auth route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "auth route works" }));

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
router.post("/register", (req, res) => {
  // validation
  const { errors, isValid } = validateRegisterData(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { name, email, password } = req.body;

  // check if email already registerd
  User.findOne({ email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    // get profile avatar if associated with email
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

    // hash password before saving new user
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
  const { errors, isValid } = validateLoginData(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Check password with hashed password
    bcrypt.compare(password, user.password).then(isMatch => {
      // Did not match, return error
      if (!isMatch) {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
      // Matched, return jsonwebtoken
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
