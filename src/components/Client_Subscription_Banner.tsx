import { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User as User_Local } from "@/types/User";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

const Client_Subscription_Banner = () => {
    const customer = useSelector((state: RootState) => state.user.currentUser as User_Local);
    const anonymousCustomer = customer === null || customer.name === "Usuário Anônimo";

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div className="Subsctiption_Banner">
            <div className="UserTab_Content_Wrapper Subsctiption_Banner_Content_Wrapper" ref={scroll_ref}>
                <div className="User_Tab_Card">
                    <h1 className="User_Tab_Card_Title">Assinatura Clube Tropical</h1>
                    <h2 className="Subsctiption_Banner_Subtitle">Que tal ter uma seleção de chocolates deliciosos chegando todo mês na sua casa?</h2>
                    <p className="Subsctiption_Banner_Description">
                        Membros do Clube Tropical recebem mensalmente uma caixa com 6 chocolates especiais, feitos com cacau de origem única - E
                        também possuem acesso a descontos de 10% em todos os pedidos.
                    </p>

                    <div className="Cart_Footer_Buttons_Container">
                        {anonymousCustomer && (
                            <button className="Cart_Footer_Warning">
                                <span className="material-icons">badge</span>Crie uma conta ou conecte-se para realizar a assinatura
                            </button>
                        )}

                        <button className={anonymousCustomer ? "Cart_Footer_Checkout_Button Disabled" : "Cart_Footer_Checkout_Button"}>
                            <p className="User_Info_Item_Edit_Btn_Text">Quero Fazer Parte do Clube Tropical!</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Barra de Progresso de Scroll */}
            <div className="Progress_Bar_Container">
                <div className="Progress_Bar_Wrapper">
                    <m.div className="Progress_Bar" style={{ scaleX }} />
                </div>
            </div>
        </div>
    );
};

export default Client_Subscription_Banner;
