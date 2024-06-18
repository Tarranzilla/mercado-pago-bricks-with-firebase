import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebaseAdmin";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function getSubscription(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { subscription_id } = req.query;
    // console.log("getting order:", subscription_id);

    if (!subscription_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (Array.isArray(subscription_id)) {
        return res.status(400).json({ error: "Invalid id" });
    }

    try {
        const userRef = firestore.collection(`projects/${projectUID}/subscriptions`).doc(subscription_id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(200).json({ message: "subscription-not-found" });
        }

        // console.log("subscription found:", doc.data());
        return res.status(200).json(doc.data());
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
