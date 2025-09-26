// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.notifyOwnersOnNewUser = functions.auth.user().onCreate(async (user) => {
    try {
        // Fetch all owners
        const ownersSnapshot = await db.collection("users")
            .where("owner", "==", true)
            .get();

        if (ownersSnapshot.empty) {
            console.log("⚠️ No owners found, skipping notifications.");
            return;
        }

        const recipients = ownersSnapshot.docs.map(doc => doc.id);

        // Build notification doc
        const notification = {
            title: "New Account Created",
            message: `A new user signed up with email: ${user.email}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            type: "system",
            createdBy: user.uid,
            recipients: recipients,
            readBy: [], // initially empty
        };

        await db.collection("notifications").add(notification);

        console.log(`✅ Notification created for owners: ${recipients}`);
    } catch (error) {
        console.error("❌ Error creating notification:", error);
    }
});
