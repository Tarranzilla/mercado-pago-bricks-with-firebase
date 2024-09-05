import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
                <title>Farol das Idéias - Tropical Cacau</title>
                <meta name="description" content="Uma Loja de Chocolates Integrada com o Mercado Pago e o Google Firebase." />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
