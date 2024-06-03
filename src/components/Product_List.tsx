import { useState, useEffect, useRef } from "react";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Product from "@/types/Product";

const Product_List = () => {
    const [products, setProducts] = useState<Product[]>([]);

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        // Fetch products from API
    }, []);

    return (
        <div className="Product_List">
            <div className="UserTab_Content_Wrapper Product_List_Content_Wrapper" ref={scroll_ref}>
                <div className="User_Tab_Card Product_List_Card">
                    <h1 className="User_Tab_Card_Title Product_List_Title">Lista de Produtos</h1>

                    {products.length > 0 ? (
                        <div>
                            {products.map((product) => (
                                <div key={product.id} className="Product_List_Card">
                                    <h2 className="Product_List_Card_Title">{product.title}</h2>
                                    <p className="Product_List_Card_Subtitle">{product.subtitle}</p>
                                    <p className="Product_List_Card_Price">R$ {product.price.toFixed(2)}</p>
                                    <img src={product.images[0].src} alt={product.images[0].alt} width={128} height={128} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhum produto encontrado.</p>
                    )}
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

export default Product_List;
