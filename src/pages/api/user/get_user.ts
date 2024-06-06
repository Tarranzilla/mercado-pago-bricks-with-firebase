import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebaseAdmin";

import { User as User_Local } from "@/types/User";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function getUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }

    try {
        const userRef = firestore.collection(`projects/${projectUID}/users`).doc(id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(200).json({ message: "user-not-found" });
        }

        const user = doc.data() as User_Local;

        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
