const express = require("express");

const { coreMemberControllers } = require("../Controllers");

const router = new express.Router();

// Create a contest API
router.post("/create-contest", coreMemberControllers.createContest);

// Edit a contest API
router.post("/edit-contest", coreMemberControllers.editContest);

// Delete a contest API
router.post("/delete-contest", coreMemberControllers.deleteContest);

module.exports = router;
