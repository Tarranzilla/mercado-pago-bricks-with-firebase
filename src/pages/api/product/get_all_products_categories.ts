import Product_Category from "@/types/Product_Category";

import { auth, firestore } from "@/lib/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getAllProductCategories(req: NextApiRequest, res: NextApiResponse) {
    const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau

    if (req.method === "GET") {
        const productsCategoriesCollectionRef = firestore.collection(`projects/${projectUID}/products_categories`);
        const productsCategoriesCollectionSnapshot = await productsCategoriesCollectionRef.get();

        const productsCategories: Product_Category[] = [];
        productsCategoriesCollectionSnapshot.forEach((productCategoryDoc) => {
            const productCategoryData = productCategoryDoc.data();
            productsCategories.push(productCategoryData as Product_Category);
        });

        res.status(200).json({ productsCategories: productsCategories });
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
