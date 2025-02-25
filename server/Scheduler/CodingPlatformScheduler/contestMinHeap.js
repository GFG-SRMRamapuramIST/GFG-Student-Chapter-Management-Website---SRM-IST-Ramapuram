const { MinPriorityQueue } = require("@datastructures-js/priority-queue");

// Initialize min-heap for contests
const contestHeap = new MinPriorityQueue((contest) => contest.timestamp);

/**
 * Adds a new contest to the heap.
 * @param {string} contestName - Name of the contest.
 * @param {string} date - Event date in YYYY-MM-DD format.
 * @param {string} endTime - Contest end time in ISO format (e.g., "2025-02-28T00:00:00.000+00:00").
 * @param {string} type - Type of contest ("codechef", "codeforces", "leetcode").
 */
function addContest(contestName, date, endTime, type) {
  const timestamp = new Date(endTime).getTime(); // Convert endTime to timestamp
  contestHeap.enqueue({ contestName, date, endTime, type, timestamp });
}

/**
 * Retrieves the contest at the top of the heap without removing it.
 * @returns {object|null} The earliest contest or null if the heap is empty.
 */
function peekTopContest() {
  return contestHeap.isEmpty() ? null : contestHeap.front();
}

/**
 * Removes the contest at the top of the heap.
 * @returns {object|null} The removed contest or null if the heap is empty.
 */
function removeTopContest() {
  return contestHeap.isEmpty() ? null : contestHeap.dequeue();
}

/**
 * Clears all contests from the heap.
 */
function clearHeap() {
  while (!contestHeap.isEmpty()) {
    contestHeap.dequeue();
  }
}

/**
 * Gets all contests in ascending order without modifying the heap.
 * @returns {Array} Sorted list of contests.
 */
function getAllContests() {
  return contestHeap.toArray().sort((a, b) => a.timestamp - b.timestamp);
}

module.exports = {
  addContest,
  peekTopContest,
  removeTopContest,
  clearHeap,
  getAllContests,
};
