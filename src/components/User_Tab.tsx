// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Gerenciamento de Estado com Redux
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Image from "next/image";

import { useMediaQuery } from "react-responsive";

// Componentes de Interface
import User_Tab_Content from "./User_Tab_Content";

// Componente de Aba de Usuário
export default function UserTab() {
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);

    const isSmallScreen = useMediaQuery({
        query: "(max-width: 1480px)",
    });

    return (
        <>
            <AnimatePresence>
                {isUserTabOpen ? (
                    <User_Tab_Content key={"User_Tab_Content"} />
                ) : (
                    <>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <m.div
                                initial={{ x: -1000 }}
                                animate={{ x: 0 }}
                                exit={{ x: -1000 }}
                                transition={{ duration: 0.5 }}
                                className="User_Tab"
                                key={"User_Tab_Cover_Image"}
                            >
                                <Image src="/brand_imgs/arte_parana.png" alt="Arte" width={400} height={800} className={"User_Tab_Cover_Image"} />
                            </m.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
