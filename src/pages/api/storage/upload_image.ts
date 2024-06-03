import { NextApiRequest, NextApiResponse } from "next";

import { auth, firestore, storage } from "@/lib/firebaseAdmin";

export default async function uploadImageHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.status(200).json({ status: "Hello!" }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
