import { NextApiRequest, NextApiResponse } from "next";
import { Subscription } from "@/types/Subscription";

import { auth, firestore } from "@/lib/firebaseAdmin";

export default async function orderCreationHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const subscription_data: Subscription = req.body;
        // console.log("Dados Recebidos para Criar o Pedido:", order_data);

        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau
        const subscriptionsCollectionRef = firestore.collection(`projects/${projectUID}/subscriptions`);

        await subscriptionsCollectionRef.doc(subscription_data.subscription_external_reference).set(subscription_data, { merge: true });

        res.status(200).json({ status: "Subscription Created!", subscription_data: subscription_data }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
