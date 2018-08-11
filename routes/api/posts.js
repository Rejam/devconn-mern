const router = require("express").Router();

/**
 * @route GET api/posts
 * @desc posts route
 * @access Public
 */
router.get("/", (req, res) => res.json({ msg: "posts route" }));

module.exports = router;
