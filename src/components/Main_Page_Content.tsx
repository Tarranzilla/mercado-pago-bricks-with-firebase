import React, { useRef } from "react";
import { useSpring, useScroll, motion as m } from "framer-motion";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Main_Page_ContentProps {
    children: React.ReactNode;
}

const Main_Page_Content: React.FC<Main_Page_ContentProps> = ({ children }) => {
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Determine the class name based on isUserTabOpen and isCartOpen
    let MainPageContentclassName = "Main_Page_Content";
    if (!isUserTabOpen && !isCartOpen) {
        MainPageContentclassName += " expanded";
    } else if (!isUserTabOpen) {
        MainPageContentclassName += " left-expanded";
    } else if (!isCartOpen) {
        MainPageContentclassName += " right-expanded"; // Assuming you want a left-expanded class for when the cart is not open but the user tab is
    }

    return (
        <div className={MainPageContentclassName}>
            <main className="Main_Page_Content_Wrapper" ref={scroll_ref}>
                {children}
            </main>

            {/* Barra de Progresso de Scroll */}
            <div className="Progress_Bar_Container">
                <div className="Progress_Bar_Wrapper">
                    <m.div className="Progress_Bar" style={{ scaleX }} />
                </div>
            </div>
        </div>
    );
};

export default Main_Page_Content;
