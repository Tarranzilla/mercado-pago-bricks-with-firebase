import Head from "next/head";

import UserTab from "@/components/User_Tab";
import Admin_Product_List from "@/components/Admin_Product_List";
import Client_Product_List from "@/components/Client_Product_List";
import Client_Cart from "@/components/Client_Cart";
import Client_Checkout from "@/components/Client_Checkout";

export default function Home() {
    return (
        <>
            <Head>
                <title>Mercado Pago e Firebase no NEXT</title>
                <meta name="description" content="Uma Loja Integrada com o Mercado Pago e o Google Firebase." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="">
                <h1 className="Website_Title">Mercado Pago e Firebase com NEXT</h1>
                {/* <PaymentMercadoPago /> */}
                <UserTab />
                <Admin_Product_List />
                <Client_Product_List />
                <Client_Cart />
                <Client_Checkout />
            </main>
        </>
    );
}
