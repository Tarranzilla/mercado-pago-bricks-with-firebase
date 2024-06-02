import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider as Redux_Provider } from "react-redux";
import { store as Redux_Store } from "@/store/store";
import { FirebaseProvider } from "@/components/Firebase_Context";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Redux_Provider store={Redux_Store}>
            <FirebaseProvider>
                <Component {...pageProps} />
            </FirebaseProvider>
        </Redux_Provider>
    );
}
