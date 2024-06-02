import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebaseAdmin";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function getOrder(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { order_id } = req.query;

    if (!order_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (Array.isArray(order_id)) {
        return res.status(400).json({ error: "Invalid id" });
    }

    try {
        const userRef = firestore.collection(`projects/${projectUID}/orders`).doc(order_id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(200).json({ message: "order-not-found" });
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
