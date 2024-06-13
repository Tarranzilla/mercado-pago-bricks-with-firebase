import React, { useRef } from "react";
import { useSpring, useScroll, motion as m } from "framer-motion";

interface Main_Page_ContentProps {
    children: React.ReactNode;
}

const Main_Page_Content: React.FC<Main_Page_ContentProps> = ({ children }) => {
    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div className="Main_Page_Content">
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
