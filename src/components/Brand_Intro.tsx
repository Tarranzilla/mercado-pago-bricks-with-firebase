import Image from "next/image";
import { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { AnimatePresence, motion as m } from "framer-motion";

import { useMediaQuery } from "react-responsive";

import Brand_About from "./Brand_About";

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

    return (
        <>
            <div className="Brand_Intro">
                <h1 className={brandIntroTitleClass}>O Brilho do Sol Manifestado em Sabor</h1>
                <div className={about ? "Intro_Image_Container Active" : "Intro_Image_Container"}>
                    <Image
                        src="/brand_imgs/Icone_TC_512_HQ.png"
                        alt="Chocolate Box"
                        width={1080}
                        height={1080}
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
