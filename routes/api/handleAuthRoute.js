const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;

// Input validation
const registerSchema = require("../../validation/register");
const loginSchema = require("../../validation/login");

// User model
const User = require("../../models/User");

const register = (req, res) => {
  // validation
  registerSchema
    .validate(req.body, {
      abortEarly: false
    })
    .then(() => {
      const { name, email, password } = req.body;
      // check if email already registerd
      User.findOne({ email }).then(user => {
        if (user)
          return res.status(400).json({ email: "Email already exists" });
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
      });
    })
    .catch(errors =>
      res
        .status(404)
        .json(
          errors.details.reduce(
            (acc, err) => ({ ...acc, [err.context.key]: err.context.label }),
            {}
          )
        )
    );
};

const login = (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password
  };
  loginSchema
    .validate(credentials, {
      abortEarly: false
    })
    .then(() => {
      const { email, password } = credentials;
      // Find user by email
      User.findOne({ email })
        .then(user => {
          if (!user) return res.status(404).json({ email: "User not found" });
          // Check password with hashed password
          bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
              // Did not match, return error
              return res.status(400).json({ password: "Password incorrect" });
            // Matched, return jsonwebtoken
            const payload = {
              id: user.id,
              name: user.name
            };
            jwt.sign(
              payload,
              secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              }
            );
          });
        })
        .catch(() => res.status(404).json({ error: "User not found" }));
    })
    .catch(errors => {
      console.log(errors);
      return res.status(400).json(
        errors.details.reduce(
          (acc, err) => ({
            ...acc,
            [err.context.key]: err.context.label
          }),
          {}
        )
      );
    });
};

module.exports = {
  register,
  login
};
