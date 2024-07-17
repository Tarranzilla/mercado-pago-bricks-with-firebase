import { NextApiRequest, NextApiResponse } from "next";

// orders_counter e subscriptions_counter
type Counter = {
    total_ammount: number;
};

type CounterUpdaterRequisition = {
    action_type: string;
    counter_type: string;
    user_id: string;
};

import { auth, firestore } from "@/lib/firebaseAdmin";

export default async function counterUpdater(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const requisition: CounterUpdaterRequisition = req.body;
        // console.log("Dados Recebidos para Criar o Pedido:", order_data);
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau

        const userDocRef = firestore.collection(`projects/${projectUID}/users`).doc(requisition.user_id);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userDoc.data();
        if (user && !user.isAdmin) {
            return res.status(403).json({ error: "User is not authorized to update the counter" });
        }

        const counterDocRef = firestore.collection(`projects/${projectUID}/counters`).doc(requisition.counter_type);
        const counterDoc = await counterDocRef.get();

        const countersCollectionRef = firestore.collection(`projects/${projectUID}/counters`);
        const counter = counterDoc.data();

        if (counter && counter.exists) {
            let newCounterValue: Counter;

            newCounterValue = {
                total_ammount: counter.total_ammount,
            };

            switch (requisition.action_type) {
                case "increment":
                    newCounterValue = {
                        total_ammount: counter.total_ammount + 1,
                    };
                    break;
                case "decrement": {
                    newCounterValue = {
                        total_ammount: counter.total_ammount - 1,
                    };
                    break;
                }
                default: {
                    throw new Error("Unsupported Action Type!");
                }
            }

            await countersCollectionRef.doc(requisition.counter_type).set(newCounterValue, { merge: true });

            res.status(200).json({ status: "Counter Updated!", action: "" }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
        } else {
            res.status(404).json({ error: "Counter not found!" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
