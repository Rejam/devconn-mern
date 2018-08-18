// Validation
const profileSchema = require("../../validation/profile");
const experienceSchema = require("../../validation/experience");
const educationSchema = require("../../validation/education");

// models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// ISSUE: CAN UPDATE PROFILE WITH NON UNIQUE HANDLE!!!!
const updateProfile = (req, res) => {
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
  profileSchema
    .validate(newProfile, { abortEarly: false })
    .then(() => {
      // Check if profile already exists for user
      Profile.findOne({ user: req.user.id }).then(profileExists => {
        if (profileExists) {
          // Profile exists => update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: newProfile },
            { new: true }
          )
            .then(updatedProfile => res.json(updatedProfile))
            .catch(() =>
              res.status(400).json({ profile: "Unable to update profile" })
            );
        } else {
          // profile doesn't exist
          // check handle is unique
          Profile.findOne({
            handle: newProfile.handle
          })
            .then(profileWithHandleExists => {
              if (profileWithHandleExists)
                return res.status(400).json({
                  handle: "Handle already in use"
                });

              // Save new profile
              Profile.create(newProfile)
                .then(newProfile => res.json(newProfile))
                .catch(() =>
                  res.status(400).json({ profile: "Could not save profile" })
                );
            })
            .catch(err => res.status(404).json(err));
        }
      });
    })
    .catch(error =>
      res.status(400).json(error.details.map(err => err.message))
    );
};

const getCurrentProfile = (req, res) => {
  // try to find user's profile
  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then(currentProfile => {
      if (!currentProfile) {
        // profile not found
        return res.status(404).json({ profile: "Profile not found" });
      }
      // profile found
      return res.json(currentProfile);
    })
    .catch(err => res.status(404).json(err));
};

const getProfileByHandle = (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profileByHandle => {
      if (!profileByHandle)
        return res
          .status(404)
          .json({ profile: "Profile not found for that handle" });

      return res.json(profileByHandle);
    })
    .catch(() => res.status(404).json({ profile: "Could not find profile" }));
};

const getProfileById = (req, res) => {
  Profile.findById(req.params.user_id)
    .populate("user", ["name", "avatar"])
    .then(profileById => res.json(profileById))
    .catch(() => res.status(404).json({ profile: "Could not find profile" }));
};

const getAllProfiles = (req, res) => {
  Profile.find({})
    .populate("user", ["name", "avatar"])
    .then(profiles => res.json(profiles))
    .catch(_ => res.status(400).json({ profile: "No profiles found" }));
};

const addExperience = (req, res) => {
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
  experienceSchema
    .validate(newExp, { abortEarly: false })
    .then(() => {
      Profile.findOne({ user: req.user._id })
        .then(profile => {
          // add to profile experience
          profile.experience = [newExp, ...profile.experience];
          profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(404).json(err));
        })
        .catch(() => res.status(404).json({ error: "Could not find profile" }));
    })
    .catch(error => error.details.map(err => err.message));
};

const addEducation = (req, res) => {
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
  educationSchema
    .validate(newEdu, { abortEarly: false })
    .then(() => {
      Profile.findOne({ user: req.user.id }).then(profile => {
        profile.education = [newEdu, ...profile.education];
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(() => res.status(404).json("Unable to save profile"));
      });
    })
    .catch(error => error.details.map(err => err.message));
};

const deleteExperience = (req, res) => {
  const { id } = req.params;
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      profile.experience = profile.experience.filter(
        exp => exp._id.toString() !== id
      );
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(() =>
          res.state(400).json({ profile: "Could not update profile" })
        );
    })
    .catch(() => res.status(404).json({ profile: "Could not find profile" }));
};

const deleteEducation = (req, res) => {
  const { id } = req.params;
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      profile.education = profile.education.filter(
        edu => edu._id.toString() !== id
      );
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(() =>
          res.status(400).json({ profile: "Could not update profile" })
        );
    })
    .catch(() => res.status(404).json({ profile: "Could not find profile" }));
};

const deleteUser = (req, res) => {
  const { id } = req.user;
  Profile.findOneAndRemove({ user: id }).then(() =>
    User.findByIdAndRemove(id).then(() => res.json({ success: true }))
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
