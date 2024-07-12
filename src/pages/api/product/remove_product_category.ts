import { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "@/lib/firebaseAdmin";

export default async function productCategoryRemovalHandler(req: NextApiRequest, res: NextApiResponse) {
    const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

    if (req.method === "POST") {
        const { category_id, user_id } = req.body; // Extracting category_id and user_id from the request body

        const userDocRef = firestore.collection(`projects/${projectUID}/users`).doc(user_id);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userDoc.data();
        if (user && !user.isAdmin) {
            return res.status(403).json({ error: "User is not authorized to delete product categories" });
        }

        const productsCategoriesCollectionRef = firestore.collection(`projects/${projectUID}/products_categories`);
        await productsCategoriesCollectionRef.doc(category_id).delete();

        res.status(200).json({ status: "Product Category Deleted Successfully!" });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
