const router = require("express").Router();

/**
 * @route GET api/profile
 * @desc profile route
 * @access Public
 */
router.get("/", (req, res) => res.json({ msg: "profile route" }));

module.exports = router;
