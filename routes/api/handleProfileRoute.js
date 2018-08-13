// Validation
const validate = require("../../validation");
const profileValidation = require("../../validation/profile");
const experienceValidation = require("../../validation/experience");
const educationValidation = require("../../validation/education");

// models
const Profile = require("../../models/Profile");

const updateProfile = () => (req, res) => {
  // Get profile data from form
  const profile = { ...req.body };
  profile.user = req.user.id;
  // Skills - split csv into array
  const { skills } = req.body;
  profile.skills = skills ? skills.split(",").map(s => s.trim()) : [];
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

const getProfileByHandle = () => (req, res) => {
  const errors = {};
  const { handle } = req.params;
  Profile.findOne({ handle })
    .populate("user", ["name", "avatar"])
    .then(profileByHandle => {
      if (!profileByHandle) {
        errors.profile = "Profile not found for that handle";
        res.status(404).json(errors);
      }
      return res.json(profileByHandle);
    })
    .catch(err => res.status(404).json(err));
};

const getProfileById = () => (req, res) => {
  const errors = {};
  const { user_id } = req.params;
  Profile.findById(user_id)
    .populate("user", ["name", "avatar"])
    .then(profileById => {
      if (!profileById) {
        errors.profile = "Profile not found for that ID";
        res.status(404).json(errors);
      }
      return res.json(profileById);
    })
    .catch(() =>
      res.status(404).json({ profile: "Profile not found for that ID" })
    );
};

const getAllProfiles = () => (req, res) => {
  const errors = {};
  Profile.find({})
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles.length) {
        errors.profile("No profiles found");
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(() => res.status(400).json({ profile: "No profiles found" }));
};

const addExperience = () => (req, res) => {
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  };
  // validate data
  const { errors, isValid } = validate(newExp, experienceValidation);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user._id }).then(profile => {
    // add to profile experience
    if (!profile) {
      // @ts-ignore
      errors.profile = "Could not find profile";
      res.status(404).json(errors);
    }
    profile.experience = [newExp, ...profile.experience];
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err => res.status(404).json(err));
  });
};

const addEducation = () => (req, res) => {
  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  };
  // Validate
  const { errors, isValid } = validate(newEdu, educationValidation);
  if (!isValid) res.status(400).json(errors);

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      //@ts-ignore
      errors.profile = "Could not find profile";
      return res.status(404).json(errors);
    }
    profile.education = [newEdu, ...profile.education];
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err => res.status(404).json("Unable to save profile"));
  });
};

module.exports = {
  updateProfile,
  getCurrentProfile,
  getProfileByHandle,
  getProfileById,
  getAllProfiles,
  addExperience,
  addEducation
};
