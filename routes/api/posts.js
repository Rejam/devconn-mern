const router = require("express").Router();

/**
 * @route GET api/posts/test
 * @desc posts route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "posts route" }));

module.exports = router;
