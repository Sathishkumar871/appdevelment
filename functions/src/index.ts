import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK to access Firestore
admin.initializeApp();
const db = admin.firestore();

/**
 * A scheduled Cloud Function that runs every 2 minutes to clean up "stale" rooms.
 * A room is considered stale if it was created more than 30 seconds ago
 * and still only has one member (the original creator).
 */
export const cleanupStaleRooms = functions.pubsub
  // This sets the schedule. It will run automatically every 2 minutes.
  .schedule("every 2 minutes")
  .onRun(async (context) => {
    
    // Get the current time to compare against
    const now = Date.now();
    
    // Calculate the timestamp for 30 seconds ago
    const thirtySecondsAgo = now - 30 * 1000; // 30 seconds in milliseconds

    const roomsRef = db.collection("rooms");

    // Create a query to find potentially stale rooms.
    // 1. Get rooms created more than 30 seconds ago.
    // 2. To keep the query fast, only look at rooms created in the last 5 minutes.
    const snapshot = await roomsRef
      .where("createdAt", "<=", thirtySecondsAgo)
      .where("createdAt", ">", now - 5 * 60 * 1000)
      .get();

    // If no rooms match the query, stop the function.
    if (snapshot.empty) {
      functions.logger.log("No recently created rooms to check for cleanup.");
      return null;
    }

    // Use a batch to delete multiple documents at once, which is more efficient.
    const batch = db.batch();
    let deletedCount = 0;

    snapshot.forEach((doc) => {
      const room = doc.data();
      
      // The final check: does the room have exactly one member?
      if (room.currentMembers && room.currentMembers.length === 1) {
        functions.logger.log(`Deleting stale room: ${doc.id}`);
        
        // Add the delete operation to the batch
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    // If there are rooms to delete, commit (run) the batch operation.
    if (deletedCount > 0) {
      await batch.commit();
      functions.logger.log(`Successfully deleted ${deletedCount} stale rooms.`);
    } else {
      functions.logger.log("No rooms met the stale criteria in this run.");
    }
    
    return null; // Indicate that the function finished successfully.
  });