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

10. Create a resource API - "{BACKEND_URL}/api/v1/core-member/create-resource"
11. Add a question to a resource API - "{BACKEND_URL}/api/v1/core-member/add-question"
12. Delete a question of a resource API - "{BACKEND_URL}/api/v1/core-member/delete-question"
13. Delete a resource API - "{BACKEND_URL}/api/v1/core-member/delete-resource"
14. Edit a resource API - "{BACKEND_URL}/api/v1/core-member/edit-resource"
15. Fetch all resources API - "{BACKEND_URL}/api/v1/core-member/fetch-all-resources"
16. Fetch all questions of a resource API - "{BACKEND_URL}/api/v1/core-member/fetch-all-questions"

17. Create announcement API - "{BACKEND_URL}/api/v1/core-member/create-announcement"
18. Delete announcement API - "{BACKEND_URL}/api/v1/core-member/delete-announcement"
19. Get all announcement API - "{BACKEND_URL}/api/v1/core-member/get-all-announcement"

20. Get all dashboard calender data API - "{BACKEND_URL}/api/v1/core-member/get-dashboard-calender-data"

21. Create a video resource API - "{BACKEND_URL}/api/v1/core-member/create-video-resource"
22. Add a video to a video resource API - "{BACKEND_URL}/api/v1/core-member/add-video"
23. Delete a video of a video resource API - "{BACKEND_URL}/api/v1/core-member/delete-video"
24. Delete a video resource API - "{BACKEND_URL}/api/v1/core-member/delete-video-resource"
25. Edit a video resource API - "{BACKEND_URL}/api/v1/core-member/edit-video-resource"
26. Fetch all video resource API - "{BACKEND_URL}/api/v1/core-member/fetch-all-video-resource"
27. Fetch all videos of a video resource API - "{BACKEND_URL}/api/v1/core-member/fetch-all-video"

28. Add festival API - "{BACKEND_URL}/api/v1/core-member/add-festival"
29. Delete festival API - "{BACKEND_URL}/api/v1/core-member/delete-festival"
30. Get all festival API - "{BACKEND_URL}/api/v1/core-member/get-all-festival"

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
router.post("/create-meeting", coreMemberControllers.createNotice);

// Delete a Meeting on Notice Board API
router.delete("/delete-meeting", coreMemberControllers.deleteNotice);

// Create MoM for a Meeting on Notice Board API
router.post("/create-mom", coreMemberControllers.createMoM);

// Delete MoM for a Meeting on Notice Board API
router.delete("/delete-mom", coreMemberControllers.deleteMoMLink);
/**************************************************************************/

/***************************** Resource APIs ******************************/
// Create a resource API
router.post("/create-resource", coreMemberControllers.createResource);

// Add a question to a resource API
router.post("/add-question", coreMemberControllers.addQuestionToResource);

// Delete a question of a resource API
router.delete(
  "/delete-question",
  coreMemberControllers.deleteQuestionFromResource
);

// Delete a resource API
router.delete("/delete-resource", coreMemberControllers.deleteResource);

// Edit a resource API
router.put("/edit-resource", coreMemberControllers.editResource);

// Fetch all resources
router.post("/fetch-all-resources", coreMemberControllers.fetchAllResources);

// Fetch all questions of a resource with filtering
router.post(
  "/fetch-all-questions",
  coreMemberControllers.fetchAllQuestionsOfResource
);

/**************************************************************************/

/***************************** Announcement APIs ******************************/
// Create announcement API
router.post("/create-announcement", coreMemberControllers.createAnnouncement);

// Delete announcement API
router.delete("/delete-announcement", coreMemberControllers.deleteAnnouncement);

// Get all announcement API
router.get("/get-all-announcement", coreMemberControllers.fetchAllAnnouncement);

/*****************************************************************************/

// Get all dashboard calender data API
router.get(
  "/get-dashboard-calender-data",
  coreMemberControllers.fetchDashboardCalenderData
);

/***************************** Video Resource APIs ******************************/

// Create a video resource API
router.post("/create-video-resource", coreMemberControllers.createVideoResource);

// Add a video to a video resource API
router.post("/add-video", coreMemberControllers.addVideoToVideoResource);

// Delete a video of a video resource API
router.delete(
  "/delete-video",
  coreMemberControllers.deleteVideoFromVideoResource
);

// Delete a video resource API
router.delete("/delete-video-resource", coreMemberControllers.deleteVideoResource);

// Edit a video resource API
router.put("/edit-video-resource", coreMemberControllers.editVideoResource);

// Fetch all video resources
router.post("/fetch-all-video-resource", coreMemberControllers.fetchAllVideoResources);

// Fetch all videos of a video resource
router.post(
  "/fetch-all-video",
  coreMemberControllers.fetchAllVideosOfVideoResource
);

/*******************************************************************************/

/******************************* FESTIVAL APIs **********************************/
// Add festival API
router.post("/add-festival", coreMemberControllers.addFestival);

// Delete festival API
router.delete("/delete-festival", coreMemberControllers.deleteFestival);

module.exports = router;
