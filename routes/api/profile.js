const router = require("express").Router();
const passport = require("passport");

// Validation
const validate = require("../../validation");
const profileValidation = require("../../validation/profile");

// models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

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
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          // profile not found
          errors.profile = "Profile not found";
          return res.status(404).json(errors);
        }
        // profile found
        return res.json(profile);
      })
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
  async (req, res) => {
    // Get profile data
    const profile = { ...req.body };
    profile.user = req.user.id;
    // Skills - split csv into array
    const { skills } = req.body;
    if (skills) profile.skills = skills.split(",");
    // validate
    const { errors, isValid } = validate(profile, profileValidation);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileExists = await Profile.findOne({ user: req.user.id });
    if (profileExists) {
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profile },
        { new: true }
      );
      return res.json(updatedProfile);
    } else {
      // profile doesn't exist
      // check handle is unique
      const handleExists = await Profile.findOne({
        handle: profile.handle
      });
      if (handleExists) {
        // @ts-ignore
        errors.handle = "Handle already in use";
        return res.status(400).json(errors);
      } else {
        // Save new profile
        const newProfile = await Profile.create(profile);
        return res.json(newProfile);
      }
    }
  }
);
module.exports = router;
