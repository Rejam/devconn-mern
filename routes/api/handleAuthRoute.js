const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;

// Input validation
const validate = require("../../validation/");
const registerValidation = require("../../validation/register");
const loginValidation = require("../../validation/login");

// User model
const User = require("../../models/User");

const register = (req, res) => {
  // validation
  const { errors, isValid } = validate(req.body, registerValidation);
  if (!isValid) return res.status(400).json(errors);

  const { name, email, password } = req.body;

  // check if email already registerd
  User.findOne({ email }).then(user => {
    if (user) {
      // @ts-ignore
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
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
          newUser.save().then(user => res.json(user));
        });
      });
    }
  });
};

const login = (req, res) => {
  const { errors, isValid } = validate(req.body, loginValidation);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      // @ts-ignore
      errors.email = "User not found";
      return res.status(404).json(errors);
    } else {
      // Check password with hashed password
      bcrypt.compare(password, user.password).then(isMatch => {
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
    }
  });
};

module.exports = {
  register,
  login
};
