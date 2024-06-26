import React, { useRef, useEffect } from "react";
import { useSpring, useScroll, motion as m } from "framer-motion";

import { useMediaQuery } from "react-responsive";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Main_Page_ContentProps {
    children: React.ReactNode;
}

const Main_Page_Content: React.FC<Main_Page_ContentProps> = ({ children }) => {
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    const isSmallScreen = useMediaQuery({
        query: "(max-width: 768px)",
    });

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Determine the class name based on isUserTabOpen and isCartOpen
    let MainPageContentclassName = "Main_Page_Content";
    if (!isUserTabOpen && !isCartOpen && !isSmallScreen) {
        MainPageContentclassName += " expanded";
    } else if (!isUserTabOpen && !isSmallScreen) {
        MainPageContentclassName += " left-expanded";
    } else if (!isCartOpen && !isSmallScreen) {
        MainPageContentclassName += " right-expanded"; // Assuming you want a left-expanded class for when the cart is not open but the user tab is
    }

    // Scroll to the top when children change
    useEffect(() => {
        if (scroll_ref.current) {
            scroll_ref.current.scrollTo(0, 0); // Scroll to the top
        }
    }, [children]);

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
