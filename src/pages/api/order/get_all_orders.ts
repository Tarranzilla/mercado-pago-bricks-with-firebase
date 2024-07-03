import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebaseAdmin";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function getAllOrders(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        // Changed from GET to POST
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { user_id } = req.body; // Changed from req.query to req.body

    if (!user_id) {
        return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    try {
        // Check if the user is an admin
        const userRef = firestore.collection(`projects/${projectUID}/users`).doc(user_id);
        const userDoc = await userRef.get();

        if (!userDoc.exists || !userDoc.data()?.isAdmin) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Retrieve the last 30 orders | orderBy("created_at", "desc").limit(30)
        const ordersRef = firestore.collection(`projects/${projectUID}/orders`);
        const snapshot = await ordersRef.get();
        const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        console.log(orders);

        return res.status(200).json(orders);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
