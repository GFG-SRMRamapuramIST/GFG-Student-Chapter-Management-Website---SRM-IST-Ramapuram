const express = require("express");

const { coreMemberControllers } = require("../Controllers");

const router = new express.Router();

/*
************************** APIs **************************

1. Create a contest API - "{BACKEND_URL}/api/v1/core-member/create-contest"
2. Edit a contest API - "{BACKEND_URL}/api/v1/core-member/edit-contest"
3. Delete a contest API - "{BACKEND_URL}/api/v1/core-member/delete-contest"
4. Create a Meeting on Notice Board API -  "{BACKEND_URL}/api/v1/core-member/create-meeting"
5. Edit meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/edit-meeting"
6. Delete meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/delete-meeting"
7. Create MoM for a Meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/create-mom"
8. Edit MoM for a Meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/edit-mom"
9. Delete MoM for a Meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/delete-mom"

**********************************************************
*/

/***************************** CONTEST APIs *******************************/
// Create a contest API
router.post("/create-contest", coreMemberControllers.createContest);

// Edit a contest API
router.post("/edit-contest", coreMemberControllers.editContest);

// Delete a contest API
router.delete("/delete-contest", coreMemberControllers.deleteContest);
/**************************************************************************/

/***************************** NOTICE BOARD APIs **************************/
// Create a Meeting on Notice Board API
router.post("/create-meeting", coreMemberControllers.createNotice)

// Edit a Meeeting on Notice Board API
router.put("/edit-meeting", coreMemberControllers.editNotice)

// Delete a Meeting on Notice Board API
router.delete("/delete-meeting", coreMemberControllers.deleteNotice)

// Create MoM for a Meeting on Notice Board API
router.post("/create-mom", coreMemberControllers.createMoM)

// Edit MoM for a Meeting on Notice Board API
router.put("/edit-mom", coreMemberControllers.editMoMLink)
  
// Delete MoM for a Meeting on Notice Board API
router.delete("/delete-mom", coreMemberControllers.deleteMoMLink)
/**************************************************************************/

module.exports = router;
