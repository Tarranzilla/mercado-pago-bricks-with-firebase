import Image from "next/image";
import { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { AnimatePresence, motion as m } from "framer-motion";

import { useMediaQuery } from "react-responsive";

import Brand_About from "./Brand_About";

import Link from "next/link";

const Brand_Intro = () => {
    const [about, setAbout] = useState(null || 0);

    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);

    const isSmallScreen = useMediaQuery({
        query: "(max-width: 1480px)",
    });

    let brandIntroTitleClass = "Brand_Intro_Title";
    if (!isCartOpen && !isUserTabOpen && !isSmallScreen) {
        brandIntroTitleClass += " Expanded";
    }

    const scrollToAnchor = () => {
        const anchor = document.querySelector("#clube-tropical");
        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <div className="Brand_Intro">
                <h1 className={brandIntroTitleClass}>O Brilho do Sol Manifestado em Sabor</h1>

                <div className="Brand_Intro_Call_To_Action">
                    <h2>Surpreenda-se com Nossos Chocolates</h2>
                    <div style={{ width: "100%", height: "2rem", position: "relative" }} onClick={scrollToAnchor}>
                        <svg width="100%" height="42" viewBox="0 0 478 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M473.474 0H4.52625C-0.436703 0 -0.958755 7.24735 3.95295 7.9587L238.427 41.917C238.807 41.972 239.193 41.972 239.573 41.917L474.047 7.9587C478.959 7.24735 478.437 0 473.474 0Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>

                <div className={about ? "Intro_Image_Container Active" : "Intro_Image_Container"}>
                    <Image
                        src="/brand_imgs/Icone_TC_512_HQ.png"
                        alt="Chocolate Box"
                        width={1600}
                        height={1600}
                        quality={100}
                        className={!about ? "Intro_Image Active" : "Intro_Image"}
                    />
                </div>
            </div>
        </>
    );
};

export default Brand_Intro;

/*

            <AnimatePresence mode="wait">
                    {about === 1 && (
                        <m.div
                            initial={{ y: -500 }}
                            animate={{ y: 0 }}
                            exit={{ y: -500 }}
                            transition={{ duration: 0.5 }}
                            key={"About_Who"}
                            className="Brand_About_Content About_Who"
                        >
                            <h2 className="Brand_About_Content_Title">Quem Somos</h2>
                            <p>
                                A Tropical Cacau é uma empresa de chocolates artesanais que visa a produção de chocolates de qualidade e com sabores
                                únicos. Nossos chocolates são feitos com cacau de origem e com ingredientes selecionados para garantir a melhor
                                experiência ao paladar.
                            </p>
                        </m.div>
                    )}

                    {about === 2 && (
                        <m.div
                            initial={{ y: -500 }}
                            animate={{ y: 0 }}
                            exit={{ y: -500 }}
                            transition={{ duration: 0.5 }}
                            key={"About_Cacau"}
                            className="Brand_About_Content About_Cacau"
                        >
                            <h2 className="Brand_About_Content_Title">A História do Cacau</h2>
                            <p>
                                O cacau é uma fruta originária da América Central e do Sul e é cultivado em países tropicais como Brasil, Costa Rica,
                                Equador, Gana e outros. O cacau é uma fruta rica em nutrientes e possui propriedades benéficas para a saúde.
                            </p>
                        </m.div>
                    )}
                </AnimatePresence>

            <div className="Brand_About">
                <button
                    className="Brand_About_Item"
                    onClick={() => {
                        if (about !== 1) {
                            setAbout(1);
                        } else {
                            setAbout(0);
                        }
                    }}
                >
                    <h3>{about === 1 ? "Voltar" : "Quem Somos"}</h3>
                </button>
                <button
                    className="Brand_About_Item"
                    onClick={() => {
                        if (about !== 2) {
                            setAbout(2);
                        } else {
                            setAbout(0);
                        }
                    }}
                >
                    <h3>{about === 2 ? "Voltar" : "A História do Cacau"}</h3>
                </button>
            </div>

*/
