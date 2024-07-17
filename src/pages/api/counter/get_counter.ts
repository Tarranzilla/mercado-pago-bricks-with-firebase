import { NextApiRequest, NextApiResponse } from "next";

// orders_counter e subscriptions_counter
type Counter = {
    total_ammount: number;
};

import { auth, firestore } from "@/lib/firebaseAdmin";

const PROJECT_ID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;
if (!PROJECT_ID) {
    throw new Error("Missing Pragmata Project ID");
}

export default async function counterGetHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau
        if (!PROJECT_ID) {
            return res.status(500).json({ error: "Missing Pragmata Project ID" });
        }

        const getCounterDocuments = async (projectUID: string) => {
            const countersDocRef = firestore.collection(`projects/${projectUID}/counters`);

            try {
                const snapshot = await countersDocRef.get();
                const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                return documents;
            } catch (error) {
                console.error("Error fetching documents: ", error);
                throw new Error("Failed to fetch documents");
            }
        };

        try {
            const counters = await getCounterDocuments(PROJECT_ID);
            res.status(200).json(counters);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
