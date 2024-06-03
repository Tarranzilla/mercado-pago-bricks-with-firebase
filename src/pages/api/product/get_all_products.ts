import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebaseAdmin";

import Product from "@/types/Product";

const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;

if (!projectUID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

export default async function getAllProducts(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const productsRef = firestore.collection(`projects/${projectUID}/products`);
        const snapshot = await productsRef.get();

        if (snapshot.empty) {
            return res.status(200).json({ message: "No products found" });
        }

        const products: Product[] = [];
        snapshot.forEach((doc) => {
            const product = doc.data() as Product;
            products.push(product);
        });

        return res.status(200).json(products);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        // handle the case where error is not an Error object
    }
}
