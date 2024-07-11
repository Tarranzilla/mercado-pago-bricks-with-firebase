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
        // Check if the user is an admin
        const userRef = firestore.collection(`projects/${projectUID}/users`).doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists || !userDoc.data()?.isAdmin) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Retrieve the last 30 orders | orderBy("created_at", "desc").limit(30)
        const usersRef = firestore.collection(`projects/${projectUID}/users`);
        const snapshot = await usersRef.get();
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        console.log(users);

        return res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
