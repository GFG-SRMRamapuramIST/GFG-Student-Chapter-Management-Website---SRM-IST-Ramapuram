const express = require("express");

const { coreMemberControllers } = require("../Controllers");

const router = new express.Router();

/*
************************** APIs **************************

1. Create a contest API - "{BACKEND_URL}/api/v1/core-member/create-contest"

3. Delete a contest API - "{BACKEND_URL}/api/v1/core-member/delete-contest"
4. Create a Meeting on Notice Board API -  "{BACKEND_URL}/api/v1/core-member/create-meeting"

6. Delete meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/delete-meeting"
7. Create MoM for a Meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/create-mom"

9. Delete MoM for a Meeting on Notice Board API - "{BACKEND_URL}/api/v1/core-member/delete-mom"

**********************************************************
*/

/***************************** CONTEST APIs *******************************/
// Create a contest API
router.post("/create-contest", coreMemberControllers.createContest);

// Delete a contest API
router.delete("/delete-contest", coreMemberControllers.deleteContest);
/**************************************************************************/

/***************************** NOTICE BOARD APIs **************************/
// Create a Meeting on Notice Board API
router.post("/create-meeting", coreMemberControllers.createNotice)

// Delete a Meeting on Notice Board API
router.delete("/delete-meeting", coreMemberControllers.deleteNotice)

// Create MoM for a Meeting on Notice Board API
router.post("/create-mom", coreMemberControllers.createMoM)
  
// Delete MoM for a Meeting on Notice Board API
router.delete("/delete-mom", coreMemberControllers.deleteMoMLink)
/**************************************************************************/

module.exports = router;
