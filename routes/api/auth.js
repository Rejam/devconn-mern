const router = require("express").Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

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

module.exports = router;
