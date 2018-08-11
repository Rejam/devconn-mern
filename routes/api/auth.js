const router = require("express").Router();

/**
 * @route GET api/auth
 * @desc auth route
 * @access Public
 */
router.get("/", (req, res) => res.json({ msg: "auth route" }));

module.exports = router;
