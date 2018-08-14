// Validation
const validate = require("../../validation");
const profileValidation = require("../../validation/profile");
const experienceValidation = require("../../validation/experience");
const educationValidation = require("../../validation/education");

// models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const updateProfile = () => (req, res) => {
  // Build profile
  const newProfile = {
    user: req.user.id,
    handle: req.body.handle,
    company: req.body.company,
    website: req.body.website,
    location: req.body.location,
    status: req.body.location,
    bio: req.body.bio,
    githubusername: req.body.githubusername,
    social: {
      youtube: req.body.youtube,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      instagram: req.body.instagram
    }
  };
  // Skills - split csv into array
  const { skills } = req.body;
  newProfile.skills = skills ? skills.split(",").map(s => s.trim()) : [];
  // validate
  const { errors, isValid } = validate(newProfile, profileValidation);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Check if profile already exists for user
  Profile.findOne({ user: req.user.id }).then(profileExists => {
    if (profileExists) {
      // Profile exists => update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: newProfile },
        { new: true }
      ).then(updatedProfile => res.json(updatedProfile));
    } else {
      // profile doesn't exist
      // check handle is unique
      Profile.findOne({
        handle: newProfile.handle
      }).then(profileWithHandleExists => {
        if (profileWithHandleExists) {
          // @ts-ignore
          errors.handle = "Handle already in use";
          return res.status(400).json(errors);
        } else {
          // Save new profile
          Profile.create(newProfile).then(newProfile => res.json(newProfile));
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

const deleteExperience = () => (req, res) => {
  const errors = {};
  const { id } = req.params;
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = "Could not find profile";
        return res.status(404).json(errors);
      }
      console.log(profile.experience, id);
      profile.experience = profile.experience.filter(
        exp => exp._id.toString() !== id
      );
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err =>
          res.state(400).json({ profile: "Could not update profile" })
        );
    })
    .catch(err => res.status(404).json(err));
};

const deleteEducation = () => (req, res) => {
  const errors = {};
  const { id } = req.params;
  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      errors.profile = "Could not find profile";
      return res.status(404).json(errors);
    }
    profile.education = profile.education.filter(
      edu => edu._id.toString() !== id
    );
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err =>
        res.status(400).json({ profile: "Could not update profile" })
      );
  });
};

const deleteUser = () => (req, res) => {
  const errors = {};
  const { id } = req.user;
  Profile.findOneAndRemove({ user: id }).then(profile =>
    User.findByIdAndRemove(id).then(user => res.json({ success: true }))
  );
};

module.exports = {
  updateProfile,
  getCurrentProfile,
  getProfileByHandle,
  getProfileById,
  getAllProfiles,
  addExperience,
  addEducation,
  deleteExperience,
  deleteEducation,
  deleteUser
};
