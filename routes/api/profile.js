const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfileData = require("../../validation/profile");

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
    if (req.body.skills) profileData.skills = req.body.skills.split(",");
    const { errors, value } = validateProfileData(profileData);

    Profile.findOne({ user: req.user.id }).then(user => {
      // profile exists: update profile
      if (user) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileData },
          { new: true }
        ).then(profile => res.json(profile));
      }
      // profile doesn't exist
      else {
        // check handle is unique
        Profile.findOne({ handle: profileData.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          } else {
            // Save new profile
            new Profile(profileData).save().then(profile => res.json(profile));
          }
        });
      }
    });
    res.json(profileData);
  }
);
module.exports = router;
