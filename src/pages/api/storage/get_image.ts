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

export default async function getImageHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Extract the file name from the request, assuming it's passed as a query parameter
        const { fileName } = req.query;
        const folderPath = "pragmatas-shop/product-imgs/";

        console.log(fileName);
        console.log(storage);
        console.log(storage.bucket());

        if (fileName === "all") {
            // Get all images
            const [files] = await storage.bucket().getFiles({ prefix: folderPath, delimiter: "/" });

            // Use Promise.all to wait for all promises returned by the map to resolve
            const fileDetails = await Promise.all(
                files.map(async (file) => {
                    // Skip the directory marker
                    if (file.name === folderPath) {
                        return null;
                    }
                    console.log(file);
                    const file_url = await getDownloadURL(file);
                    console.log(file_url);
                    return { name: file.name, url: file_url };
                })
            );

            // Filter out null values if any directory markers were skipped
            const filteredFileDetails = fileDetails.filter((detail) => detail !== null);

            console.log(filteredFileDetails);
            res.status(200).json({ files: filteredFileDetails });
        } else {
            // Get a single image
            if (!fileName) {
                res.status(400).json({ error: "Bad Request" }); // Retorna um JSON com o erro de pedido inválido
                return;
            }

            const file = storage.bucket().file(`${folderPath}${fileName}`);
            const file_url = await getDownloadURL(file);
            console.log(file.name);
            console.log(file_url);
            res.status(200).json({ name: file.name, url: file_url });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
