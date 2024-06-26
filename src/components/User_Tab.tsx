// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

import { useState } from "react";

// Gerenciamento de Estado com Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUserTabCoverImageOpen } from "@/store/slices/interface_slice";

import Image from "next/image";

import { useMediaQuery } from "react-responsive";

// Componentes de Interface
import User_Tab_Content from "./User_Tab_Content";

// Componente de Aba de Usuário
export default function UserTab() {
    const dispatch = useDispatch();
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const isCoverImageOpen = useSelector((state: RootState) => state.interface.isUserTabCoverImageOpen);

    const isSmallScreen = useMediaQuery({
        query: "(max-width: 1480px)",
    });

    const setUserTabCoverImageAction = (value: boolean) => {
        dispatch(setUserTabCoverImageOpen(value));
    };

    return (
        <>
            <AnimatePresence>{isUserTabOpen ? <User_Tab_Content key={"User_Tab_Content"} /> : <></>}</AnimatePresence>
        </>
    );
}

/*
{isCoverImageOpen && (
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
                                        <Image
                                            src="/brand_imgs/arte_parana.png"
                                            alt="Arte"
                                            width={400}
                                            height={800}
                                            className={"User_Tab_Cover_Image"}
                                        />

                                        <m.button
                                            className="User_Tab_Cover_Image_Button"
                                            onClick={() => {
                                                setUserTabCoverImageAction(!isCoverImageOpen);
                                            }}
                                        >
                                            X
                                        </m.button>
                                    </m.div>
                                )}
                            </>
                        )}

*/
