import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "@/types/Order";

import { auth, firestore } from "@/lib/firebaseAdmin";

export default async function specificOrderUpdate(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;
        const { userId, orderId, editedOrder }: { userId: string; orderId: string; editedOrder: Order } = req.body;

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
        const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);
        const orderRef = ordersCollectionRef.doc(orderId);

        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            return res.status(404).json({ error: "Order not found" });
        }

        await orderRef.set(editedOrder, { merge: true });

        res.status(200).json({ status: "Order updated successfully!", order_data: editedOrder });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
