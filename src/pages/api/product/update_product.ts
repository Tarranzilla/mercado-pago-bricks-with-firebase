import Product from "@/types/Product";
import { auth, firestore } from "@/lib/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function productUpdateHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const new_product_data: Product = req.body;
        // console.log("Dados Recebidos para Criar o Pedido:", order_data);

        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau
        const productsCollectionRef = firestore.collection(`projects/${projectUID}/products`);

        await productsCollectionRef.doc(new_product_data.id).set(new_product_data, { merge: true });

        res.status(200).json({ status: "Order Updated!", new_product_data: new_product_data }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
