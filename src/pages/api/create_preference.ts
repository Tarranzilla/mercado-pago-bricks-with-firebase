import { NextApiRequest, NextApiResponse } from "next";

// Geradores de ID
import { v4 as uuidv4 } from "uuid";
import { ulid } from "ulid";

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

import { Cart_Item } from "@/types/Cart_Item";

// Função para gerar um ID de pedido unico e aleatório
function generateOrderID_UUID_V4() {
    let customOrderID = uuidv4();
    console.log(customOrderID);
    return customOrderID;
}

// Função para gerar um ID de pedido ordenado e unico
function generateOrderID_ULID() {
    let customOrderID = ulid();
    console.log(customOrderID);
    return customOrderID;
}

// Verifica se a aplicação está em produção
const isProduction = process.env.IS_PRODUCTION === "true";

const MP_ACCESS_TOKEN = isProduction ? process.env.MP_PROD_ACCESS_TOKEN : process.env.MP_DEV_ACCESS_TOKEN;

if (!MP_ACCESS_TOKEN) {
    throw new Error("The MP_ACCESS_TOKEN environment variable is not defined");
}

// Adicione as credenciais
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN }); // Jogar o Access Token para o .env

/*  Gerenciador de Criação de Preferências. 
    
    Recebe uma Array de Itens do Carrinho e Retorna um 
    Objeto com o ID da Preferência e a Referência Externa

{
    id: "<ID_PREFERENCIA>",
    custom_reference: "<REFERENCIA_EXTERNA>"
}

    If you're using Next.js, it also automatically parses incoming JSON and sets req.body to the resulting object. 
    So, you don't need to call JSON.parse(req.body) - you can just use req.body directly.

*/

export default function preferenceHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let cartItems = req.body.map((item: Cart_Item) => ({
            title: item.id,
            unit_price: item.price,
            quantity: item.quantity,
        }));

        // console.log(cartItems);
        const preference = new Preference(client);
        const external_reference = generateOrderID_UUID_V4();

        // Provavelmente aqui eu já poderia inserir varias informações sobre o cliente, endereço e formas de pagamento!

        /*
            Isso está acontecendo por causa da url de init_point 
            
            Antes funcionava da mesma forma que produção, assim:
            https://www.mercadopago.com.br/checkout/v1/redirect?pref_id.....

            Agora deve ser assim no ambiente de teste
            https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id.....
        */

        preference
            .create({
                body: {
                    items: cartItems,
                    back_urls: {
                        success: "https://farol-das-ideias.vercel.app/checkout_success",
                        failure: "https://farol-das-ideias.vercel.app/checkout_fail",
                        pending: "https://farol-das-ideias.vercel.app/checkout_pending",
                    },
                    external_reference: external_reference,
                },
                requestOptions: {
                    idempotencyKey: external_reference,
                },
            })
            .then(function (response) {
                console.log("Preference Created, Data Recieved From Mercado Pago:", response);
                console.log(`Returning Preference ID: ${response.id} and External Reference ID: ${external_reference} as a Response.`);
                res.json({
                    id: response.id,
                    external_reference: external_reference,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    } else if (req.method === "GET") {
        res.status(200).send("OK");
    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
