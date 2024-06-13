import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider as Redux_Provider } from "react-redux";
import { store as Redux_Store } from "@/store/store";
import { FirebaseProvider } from "@/components/Firebase_Context";

import Navbar from "@/components/Navbar";
import UserTab from "@/components/User_Tab";
import Client_Cart from "@/components/Client_Cart";
import Main_Page_Content from "@/components/Main_Page_Content";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Redux_Provider store={Redux_Store}>
            <FirebaseProvider>
                <Navbar />
                <UserTab />
                <Client_Cart />

                <Main_Page_Content>
                    <Component {...pageProps} />
                </Main_Page_Content>
            </FirebaseProvider>
        </Redux_Provider>
    );
}
