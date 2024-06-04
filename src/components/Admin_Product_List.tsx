import { useState, useEffect, useRef } from "react";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Product from "@/types/Product";

import productList from "@/data/products_list";

import axios from "axios";

const NEXT_PUBLIC_PATH_API_CREATE_PRODUCT = process.env.NEXT_PUBLIC_PATH_API_CREATE_PRODUCT;
const NEXT_PUBLIC_PATH_API_GET_PRODUCT = process.env.NEXT_PUBLIC_PATH_API_GET_PRODUCT;
const NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS;

if (!NEXT_PUBLIC_PATH_API_CREATE_PRODUCT) {
    throw new Error(".env: NEXT_PUBLIC_PATH_API_CREATE_PRODUCT não definido.");
}

if (!NEXT_PUBLIC_PATH_API_GET_PRODUCT) {
    throw new Error(".env: NEXT_PUBLIC_PATH_API_GET_PRODUCT não definido.");
}

if (!NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS) {
    throw new Error(".env: NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS não definido.");
}

const Admin_Product_List = () => {
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
        axios.get(NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS).then((response) => {
            setProducts(response.data);
            console.log("Produtos Recebidos:", response.data);
        });
    }, []);

    return (
        <div className="Product_List">
            <div className="UserTab_Content_Wrapper Product_List_Content_Wrapper" ref={scroll_ref}>
                <div className="User_Tab_Card Product_List_Card">
                    <h1 className="User_Tab_Card_Title Product_List_Title">Editor de Produtos</h1>

                    {products.length > 0 ? (
                        <div className="Product_List_List">
                            {products.map((product) => (
                                <div key={product.id} className="Product_List_Card">
                                    <div className="Product_List_Card_Image_Container">
                                        {product.images && product.images.length > 0 && (
                                            <img
                                                className="Product_List_Card_Image"
                                                src={product.images[0].src}
                                                alt={product.images[0].alt}
                                                width={128}
                                                height={128}
                                            />
                                        )}
                                    </div>

                                    <div className="Product_List_Card_Info">
                                        <h2 className="Product_List_Card_Title">{product.title}</h2>
                                        <p className="Product_List_Card_Subtitle">{product.subtitle}</p>

                                        <div className="Product_List_Card_Info_Footer">
                                            <p className="Product_List_Card_Price">R$ {product.price},00</p>
                                            <div className="Product_List_Card_Edit_Btn" onClick={() => {}}>
                                                <span className="material-icons User_Tab_Edit_Icon">edit</span>
                                                <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                                            </div>
                                            <div className="Product_List_Card_Edit_Btn" onClick={() => {}}>
                                                <span className="material-icons User_Tab_Edit_Icon">delete</span>
                                                <p className="User_Info_Item_Edit_Btn_Text">excluir</p>
                                            </div>
                                        </div>
                                    </div>
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

export default Admin_Product_List;