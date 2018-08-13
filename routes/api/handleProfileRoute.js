// @ts-ignore
// Validation
const validate = require("../../validation");
const profileValidation = require("../../validation/profile");

// models
const Profile = require("../../models/Profile");

const updateProfile = () => (req, res) => {
  // Get profile data from form
  const profile = { ...req.body };
  profile.user = req.user.id;
  // Skills - split csv into array
  const { skills } = req.body;
  profile.skills = skills ? skills.split(",") : [];
  // validate
  const { errors, isValid } = validate(profile, profileValidation);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Check if profile already exists for user
  Profile.findOne({ user: req.user.id }).then(profileExists => {
    if (profileExists) {
      // Profile exists => update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profile },
        { new: true }
      ).then(updatedProfile => res.json(updatedProfile));
    } else {
      // profile doesn't exist
      // check handle is unique
      Profile.findOne({
        handle: profile.handle
      }).then(profileWithHandleExists => {
        if (profileWithHandleExists) {
          // @ts-ignore
          errors.handle = "Handle already in use";
          return res.status(400).json(errors);
        } else {
          // Save new profile
          Profile.create(profile).then(newProfile => res.json(newProfile));
        }
      });
    }
  });
};

const getCurrentProfile = () => (req, res) => {
  const errors = {};
  // pull user id from authenticated user
  const { id } = req.user;

  // try to find user's profile
  Profile.findOne({ user: id })
    .populate("user", ["name", "avatar"])
    .then(currentProfile => {
      if (!currentProfile) {
        // profile not found
        errors.profile = "Profile not found";
        return res.status(404).json(errors);
      }
      // profile found
      return res.json(currentProfile);
    })
    .catch(err => res.status(404).json(err));
};

module.exports = {
  updateProfile,
  getCurrentProfile
};
