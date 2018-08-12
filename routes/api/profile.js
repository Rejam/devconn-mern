const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Validation
const validate = require("../../validation");
const profileValidation = require("../../validation/profile");

// models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * @route GET api/profile/test
 * @desc profile route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "profile route" }));

/**
 * @route GET api/profile
 * @desc get current user profile
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // pull user id from authenticated user
    const { id } = req.user;

    // try to find user's profile
    Profile.findOne({ user: id })
      .then(profile => {
        if (!profile) {
          // profile not found
          errors.profile = "Profile not found";
          return res.status(404).json(errors);
        } else {
          // profile found
          return res.json(profile);
        }
      })
      // catch mongoose query error
      .catch(err => res.status(404).json(err));
  }
);

/**
 * @route POST api/profile
 * @desc Create/Update user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get profile data
    const profileData = { ...req.body };
    profileData.user = req.user.id;
    // Skills - split csv into array
    const { skills } = req.body;
    if (skills) profileData.skills = skills.split(",");
    // validate
    const { errors, isValid } = validate(profileData, profileValidation);
    if (!isValid) {
      res.status(400).json(errors);
    } else {
      Profile.findOne({ user: req.user.id }).then(user => {
        if (user) {
          // profile exists: update profile
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileData },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // profile doesn't exist
          // check handle is unique
          Profile.findOne({ handle: profileData.handle }).then(profile => {
            if (profile) {
              errors.handle = "That handle already exists";
              res.status(400).json(errors);
            } else {
              // Save new profile
              Profile.create(profileData).then(profile => res.json(profile));
            }
          });
        }
      });
    }
  }
);
module.exports = router;
