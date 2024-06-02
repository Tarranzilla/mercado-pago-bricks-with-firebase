import { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "@/lib/firebaseAdmin";

import { User as User_Client } from "@/types/User";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { id, name, email, avatar_url, isOwner, isAdmin, isEditor, isSubscriber, address, telephone, orders }: User_Client = req.body;

    try {
        if (!id || !name || !email) {
            throw new Error("Missing required fields");
        }

        const userRef = firestore.collection(`projects/${projectUID}/users`).doc(id);

        const new_user = {
            id,
            name,
            email,
            avatar_url,
            isOwner,
            isAdmin,
            isEditor,
            isSubscriber,
            address,
            telephone,
            orders,
            created_at: new Date(),
        };

        await userRef.set(new_user, { merge: true });

        return res.status(200).json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
