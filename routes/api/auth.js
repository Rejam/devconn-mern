const router = require("express").Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secretOrKey = require("../../config/keys").secretOrKey;

// Input validation
const validate = require("../../validation/");
const registerValidation = require("../../validation/register");
const loginValidation = require("../../validation/login");

// User model
const User = require("../../models/User");

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
router.post("/register", async (req, res) => {
  // validation
  const { errors, isValid } = validate(req.body, registerValidation);
  if (!isValid) return res.status(400).json(errors);

  const { name, email, password } = req.body;

  // check if email already registerd
  const user = await User.findOne({ email });
  if (user) {
    // @ts-ignore
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
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      const user = await newUser.save();
      res.json(user);
    });
  });
});
/**
 * @route POST api/auth/login
 * @desc Login user / returning JWT token
 * @access Public
 */
router.post("/login", async (req, res) => {
  const { errors, isValid } = validate(req.body, loginValidation);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // @ts-ignore
    errors.email = "User not found";
    return res.status(404).json(errors);
  }
  // Check password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Did not match, return error
    // @ts-ignore
    errors.password = "Password incorrect";
    return res.status(400).json(errors);
  } else {
    // Matched, return jsonwebtoken
    const payload = {
      id: user.id,
      name: user.name
    };
    jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      res.json({
        success: true,
        token: `Bearer ${token}`
      });
    });
  }
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
