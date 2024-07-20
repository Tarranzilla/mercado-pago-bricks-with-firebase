import { NextApiRequest, NextApiResponse } from "next";

import { auth, firestore, storage } from "@/lib/firebaseAdmin";
import { getDownloadURL } from "firebase-admin/storage";

/*

// Get Auth and Firestore instances
const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

export { auth, firestore, storage };

*/

export default async function uploadImageHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        // Extract the file name from the request, assuming it's passed as a query parameter
        const { newFile } = req.body;
        const folderPath = "pragmatas-shop/product-imgs/";

        console.log(newFile);
        console.log(storage);
        console.log(storage.bucket());

        if (!newFile) {
            res.status(400).json({ error: "Bad Request" }); // Retorna um JSON com o erro de pedido inválido
            return;
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
