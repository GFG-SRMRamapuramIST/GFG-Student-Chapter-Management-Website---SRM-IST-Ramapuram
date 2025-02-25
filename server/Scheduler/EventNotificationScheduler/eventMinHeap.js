const { MinPriorityQueue } = require("@datastructures-js/priority-queue");

// Initialize min-heap for events
const eventHeap = new MinPriorityQueue((event) => event.timestamp);

/**
 * Adds a new event to the heap.
 * @param {string} eventId - Unique identifier for the event.
 * @param {string} date - Event date in YYYY-MM-DD format.
 * @param {string} startTime - Event start time in HH:MM format.
 * @param {string} type - Type of event ("meeting" or "contest").
 */
function addEvent(eventId, date, startTime, type) {
  const timestamp = new Date(startTime).getTime(); // Use startTime directly
  eventHeap.enqueue({ eventId, date, startTime, type, timestamp });
}

/**
 * Retrieves the event at the top of the heap without removing it.
 * @returns {object|null} The earliest event or null if the heap is empty.
 */
function peekTopEvent() {
  return eventHeap.isEmpty() ? null : eventHeap.front();
}

/**
 * Removes the event at the top of the heap.
 * @returns {object|null} The removed event or null if the heap is empty.
 */
function removeTopEvent() {
  return eventHeap.isEmpty() ? null : eventHeap.dequeue();
}

/**
 * Clears all events from the heap.
 */
function clearHeap() {
  while (!eventHeap.isEmpty()) {
    eventHeap.dequeue();
  }
}

/**
 * Gets all events in ascending order without modifying the heap.
 * @returns {Array} Sorted list of events.
 */
function getAllEvents() {
  return eventHeap.toArray().sort((a, b) => a.timestamp - b.timestamp);
}

module.exports = {
  addEvent,
  peekTopEvent,
  removeTopEvent,
  clearHeap,
  getAllEvents,
};
