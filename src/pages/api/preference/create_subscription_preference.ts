import { NextApiRequest, NextApiResponse } from "next";

// Geradores de ID
import { v4 as uuidv4 } from "uuid";
import { ulid } from "ulid";

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

import { Cart_Item } from "@/types/Cart_Item";
import { User } from "@/types/User";

export declare type Identification = {
    type?: string;
    number?: string;
    identification?: number;
};
export declare type Address = {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
};
export declare type Items = {
    id: string;
    title: string;
    description?: string;
    picture_url?: string;
    category_id?: string;
    quantity: number;
    currency_id?: string;
    unit_price: number;
};
export declare type Phone = {
    area_code?: string;
    number?: string;
};
export declare type Shipments = {
    mode?: string;
    local_pickup?: boolean;
    dimensions?: string;
    default_shipping_method?: number;
    free_methods?: Array<FreeMethods>;
    cost?: number;
    free_shipping?: boolean;
    receiver_address?: ReceiverAddress;
    express_shipment?: boolean;
};
export declare type FreeMethods = {
    id?: number;
};
export declare type ReceiverAddress = {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
    floor?: string;
    apartment?: string;
    city_name?: string;
    state_name?: string;
    country_name?: string;
};
export declare type Paging = {
    total?: number;
    offset?: number;
    limit?: number;
};
export declare type CustomerCardCardholder = {
    name?: string;
    identification?: Identification;
};
export declare type Tax = {
    type?: string;
    value?: number;
};

export declare type Config = {
    accessToken: string;
    options?: Options;
};
export declare type Options = {
    timeout?: number;
    idempotencyKey?: string;
    plataformId?: string;
    integratorId?: string;
    corporationId?: string;
};
export declare interface ApiResponse {
    api_response: ResponseFields;
}
export declare type ResponseFields = {
    status: number;
    headers: [string, string[]];
};

export declare type Payer = {
    name?: string;
    surname?: string;
    email?: string;
    phone?: Phone;
    identification?: Identification;
    address?: Address;
    date_created?: string;
    last_purchase?: string;
};
export declare type DifferentialPricing = {
    id?: number;
};
export declare type ExcludedPaymentMethods = {
    id?: string;
};
export declare type ExcludedPaymentTypes = {
    id?: string;
};
export declare type PaymentMethods = {
    default_card_id?: string;
    default_payment_method_id?: string;
    excluded_payment_methods?: Array<ExcludedPaymentMethods>;
    excluded_payment_types?: Array<ExcludedPaymentTypes>;
    installments?: number;
    default_installments?: number;
};
export declare type TrackValues = {
    conversion_id?: string;
    conversion_label?: string;
    pixel_id?: string;
};
export declare type Track = {
    type?: string;
    values?: TrackValues;
};
export declare type BackUrls = {
    success?: string;
    pending?: string;
    failure?: string;
};
export declare type RedirectUrls = {
    success?: string;
    failure?: string;
    pending?: string;
};

type PreferenceRequest = {
    additional_info?: string;
    auto_return?: string;
    back_urls?: BackUrls;
    binary_mode?: boolean;
    coupon_code?: string;
    coupon_labels?: Array<string>;
    date_of_expiration?: string;
    differential_pricing?: DifferentialPricing;
    expiration_date_from?: string;
    expiration_date_to?: string;
    expires?: boolean;
    external_reference?: string;
    items: Array<Items>;
    marketplace?: string;
    marketplace_fee?: number;
    metadata?: any;
    notification_url?: string;
    operation_type?: string;
    payer?: Payer;
    payment_methods?: PaymentMethods;
    processing_modes?: Array<string>;
    purpose?: string;
    redirect_urls?: RedirectUrls;
    shipments?: Shipments;
    statement_descriptor?: string;
    taxes?: Array<Tax>;
    tracks?: Array<Track>;
};

interface PreferenceResponse extends ApiResponse {
    additional_info?: string;
    auto_return?: string;
    back_urls?: BackUrls;
    binary_mode?: boolean;
    client_id?: string;
    collector_id?: number;
    coupon_code?: string;
    coupon_labels?: Array<string>;
    date_created?: string;
    date_of_expiration?: string;
    differential_pricing?: DifferentialPricing;
    expiration_date_from?: string;
    expiration_date_to?: string;
    expires?: boolean;
    external_reference?: string;
    id?: string;
    init_point?: string;
    internal_metadata?: any;
    items?: Array<Items>;
    marketplace?: string;
    marketplace_fee?: number;
    metadata?: any;
    notification_url?: string;
    operation_type?: string;
    payer?: Payer;
    payment_methods?: PaymentMethods;
    processing_modes?: Array<string>;
    purpose?: string;
    redirect_urls?: RedirectUrls;
    sandbox_init_point?: string;
    site_id?: string;
    shipments?: Shipments;
    statement_descriptor?: string;
    tracks?: Array<Track>;
    taxes?: Array<Tax>;
}

// Função para gerar um ID de pedido unico e aleatório
function generateOrderID_UUID_V4() {
    let customOrderID = uuidv4();
    // console.log("UUID Gerado para o novo Pedido: ",customOrderID);
    return customOrderID;
}

// Função para gerar um ID de pedido ordenado e unico
function generateOrderID_ULID() {
    let customOrderID = ulid();
    // console.log("ULID Gerado para o novo Pedido: ",customOrderID);
    return customOrderID;
}

type SubscriptionDetails = {
    plan_id: string;
    plan_name: string;
    duration: number;
    start_date: string;
};

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
        let { customer, subscriptionRequest }: { customer: User; subscriptionRequest: SubscriptionDetails } = req.body;

        console.log("Dados Recebidos do Cliente:", customer);
        console.log("Detalhes da Assinatura Recebidos:", subscriptionRequest);

        const customTitle = `Assinatura ${subscriptionRequest.plan_name} - ${subscriptionRequest.duration} Meses`;

        let processedSubscriptionDetail = {
            id: subscriptionRequest.plan_id,
            title: customTitle,
            unit_price: subscriptionRequest.duration * 120,
            quantity: 1,
        };

        console.log("Detalhes da Assinatura Processados:", processedSubscriptionDetail);

        // console.log(cartItems);
        const preference = new Preference(client);
        const external_reference = "ASSINATURA-" + generateOrderID_UUID_V4();

        // Provavelmente aqui eu já poderia inserir varias informações sobre o cliente, endereço e formas de pagamento!

        /*
            Isso está acontecendo por causa da url de init_point 
            
            Antes funcionava da mesma forma que produção, assim:
            https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=201803820-35e8fbb3-516c-4582-9582-bb3fc0897c97

            Agora deve ser assim no ambiente de teste
            https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=201803820-35e8fbb3-516c-4582-9582-bb3fc0897c97
        */

        preference
            .create({
                body: {
                    items: [processedSubscriptionDetail],
                    back_urls: {
                        success: "https://farol-das-ideias.vercel.app",
                        failure: "https://farol-das-ideias.vercel.app/checkout_fail",
                        pending: "https://farol-das-ideias.vercel.app/checkout_pending",
                    },
                    external_reference: external_reference,
                    notification_url: "https://farol-das-ideias.vercel.app/api/order/update_order?source_news=webhooks",
                    payer: {
                        name: customer.name,
                        surname: customer.name,
                        email: customer.email,
                        phone: {
                            area_code: "41",
                            number: "99999999",
                        },
                        address: {
                            zip_code: customer.address.zip,
                            street_name: customer.address.street,
                            street_number: parseInt(customer.address.number.replace(/\D/g, "")),
                        },
                    },
                    payment_methods: {
                        installments: subscriptionRequest.duration,
                    },

                    // aqui é possivel adicionar shipment, taxes, tracks, etc
                },
                requestOptions: {
                    idempotencyKey: external_reference,
                },
            })
            .then(function (response) {
                // console.log("Preference Created, Response Data Recieved From Mercado Pago:", response);
                // console.log(`Returning Preference ID: ${response.id} and External Reference ID: ${external_reference} as a Response.`);
                res.json({
                    id: response.id,
                    external_reference: external_reference,
                    full_preference: response,
                });
            })
            .catch(function (error) {
                console.log("Erro ao Criar Preferência!", error);
            });
    } else if (req.method === "GET") {
        res.status(200).send("OK");
    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
