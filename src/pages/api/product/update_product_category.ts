import Product_Category from "@/types/Product_Category";

import { auth, firestore } from "@/lib/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function productCategoryUpdateHandler(req: NextApiRequest, res: NextApiResponse) {
    const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau

    if (req.method === "POST") {
        const { updated_product_category_data, user_id } = req.body; // Extracting user_id along with product category data

        const userDocRef = firestore.collection(`projects/${projectUID}/users`).doc(user_id);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userDoc.data();
        if (user && !user.isAdmin) {
            return res.status(403).json({ error: "User is not authorized to create product categories" });
        }

        const productsCategoriesCollectionRef = firestore.collection(`projects/${projectUID}/products_categories`);

        await productsCategoriesCollectionRef.doc(updated_product_category_data.id).set(updated_product_category_data, { merge: true });

        res.status(200).json({ status: "Product Category Updated!", updated_product_category_data: updated_product_category_data }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
