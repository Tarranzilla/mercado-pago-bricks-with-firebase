import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/firebaseAdmin";

export default async function verifyToken(req: NextApiRequest, res: NextApiResponse) {
    const idToken = req.headers.authorization;

    if (!idToken) {
        return res.status(401).json({ error: "No authorization token provided" });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return res.status(200).json({ uid: decodedToken.uid });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
