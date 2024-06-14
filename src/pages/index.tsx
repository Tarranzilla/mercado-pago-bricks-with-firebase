import Head from "next/head";

import Brand_Intro from "@/components/Brand_Intro";
import Client_Subscription_Banner from "@/components/Client_Subscription_Banner";
import Client_Product_List from "@/components/Client_Product_List";

export default function Home() {
    return (
        <>
            <Head>
                <title>Mercado Pago e Firebase no NEXT</title>
                <meta name="description" content="Uma Loja Integrada com o Mercado Pago e o Google Firebase." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Brand_Intro />
            <Client_Subscription_Banner />
            <Client_Product_List />
        </>
    );
}

// <Admin_Product_List />
