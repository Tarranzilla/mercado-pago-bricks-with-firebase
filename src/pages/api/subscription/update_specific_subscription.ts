import { NextApiRequest, NextApiResponse } from "next";
import { Subscription } from "@/types/Subscription";

import { auth, firestore } from "@/lib/firebaseAdmin";

export default async function specificSubscriptionUpdate(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;
        const { userId, subscriptionId, editedSubscription }: { userId: string; subscriptionId: string; editedSubscription: Subscription } = req.body;

        // Check if the user exists and is an admin
        const userRef = firestore.collection(`projects/${projectUID}/users`).doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userDoc.data();
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: "Access denied. User is not an admin." });
        }

        // If user is an admin, proceed to update the order
        const subscriptionsCollectionRef = firestore.collection(`projects/${projectUID}/subscriptions`);
        const subscriptionRef = subscriptionsCollectionRef.doc(subscriptionId);

        const subscriptionDoc = await subscriptionRef.get();
        if (!subscriptionDoc.exists) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        await subscriptionRef.set(editedSubscription, { merge: true });

        res.status(200).json({ status: "Subscription updated successfully!", subscription_data: editedSubscription });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
