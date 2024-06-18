import { useState, useEffect, useRef } from "react";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Product from "@/types/Product";

// Redux para gerenciamento de contexto
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { setCartOpen } from "@/store/slices/interface_slice";
import { addCartItem } from "@/store/slices/cart_slice";

// import productList from "@/data/products_list";

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

const Client_Product_List = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);

    const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
    // all, barras clásssicas, discos, bombons, dia dos pais, dia dos namorados, páscoa,
    const categories = ["Todos", "Barras Clássicas", "Barras Especiais", "Discos", "Bombons", "Dia dos Pais", "Dia dos Namorados", "Páscoa"];

    const [activeCategory, setActiveCategory] = useState("Todos");
    const [activePriceFilter, setActivePriceFilter] = useState("all"); // all, asc, desc
    const [activeProducts, setActiveProducts] = useState<Product[]>([]);
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

    const [activeLayout, setActiveLayout] = useState("list"); // grid, list,

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const setCartOpenAction = (isOpen: boolean) => {
        dispatch(setCartOpen(isOpen));
    };

    const addToCartAction = (product: Product) => {
        dispatch(addCartItem({ product: product }));
    };

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
            setActiveProducts(response.data);
            setSortedProducts(response.data);
            console.log("Produtos Recebidos:", response.data);
        });
    }, []);

    useEffect(() => {
        let filteredProducts = products;

        // Filter by category
        if (activeCategory !== "Todos") {
            filteredProducts = filteredProducts.filter((product) => product.category === activeCategory);
        }

        // Create a new array before sorting
        let sortedProducts = [...filteredProducts];

        // Sort by price
        if (activePriceFilter === "desc") {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (activePriceFilter === "asc") {
            sortedProducts.sort((a, b) => a.price - b.price);
        }

        setActiveProducts(sortedProducts);
    }, [activeCategory, activePriceFilter, products]);

    return (
        <div className="Product_List">
            <div className="User_Tab_Card Product_List_Container">
                <h1 className="User_Tab_Card_Title Product_List_Title">Loja de Chocolates</h1>
                <h2 className="Subsctiption_Banner_Subtitle">Nossos chocolates são feitos com ingredientes frescos e cuidadosamente selecionados!</h2>
                <p className="Subsctiption_Banner_Description">
                    A cada estação buscamos desenvolver novos sabores capazes de refletir as épocas festivas e os ingredientes disponíveis.
                </p>

                <div className="Product_List_Filter">
                    <button
                        className={isFilterCollapsed ? "Product_List_Filter_Collapse_Btn Active" : "Product_List_Filter_Collapse_Btn"}
                        onClick={() => {
                            setIsFilterCollapsed(!isFilterCollapsed);
                        }}
                    >
                        <span className="material-icons">expand_less</span>
                    </button>
                    <h2 className="Product_List_Filter_Title">Encontre seu Chocolate Ideal</h2>

                    {!isFilterCollapsed && (
                        <div className="Product_List_Filter_Options">
                            <div className="Product_List_Filter_Group">
                                <div className="Product_List_Filter_Categories">
                                    {categories.map((category) => (
                                        <button
                                            className={activeCategory === category ? "Filter_Category_Btn Active" : "Filter_Category_Btn"}
                                            key={category}
                                            onClick={() => {
                                                setActiveCategory(category);
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="Product_List_Filter_Group">
                                <span className="material-icons">filter_list</span>
                                <select
                                    className="Product_List_Filter_Select"
                                    value={activePriceFilter}
                                    onChange={(e) => setActivePriceFilter(e.target.value)}
                                >
                                    <option className="Product_List_Filter_Select_Option" value="all">
                                        Novidades
                                    </option>
                                    <option className="Product_List_Filter_Select_Option" value="asc">
                                        Menor Preço
                                    </option>
                                    <option className="Product_List_Filter_Select_Option" value="desc">
                                        Maior Preço
                                    </option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {products.length > 0 ? (
                    <div className="Product_List_List">
                        {activeProducts.map((product) => (
                            <m.div layout key={product.id} className="Product_List_Card">
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
                                    <div className="Product_List_Card_Info_Header">
                                        <h2 className="Product_List_Card_Title">{product.title}</h2>
                                        <p className="Product_List_Card_Price">R$ {product.price},00</p>
                                    </div>

                                    <p className="Product_List_Card_Subtitle">{product.subtitle}</p>

                                    <m.div className="Product_List_Card_Info_Footer">
                                        <AnimatePresence>
                                            {cartItems.find((item) => item.product.id === product.id) && (
                                                <m.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="Product_List_Card_CartQtty_Indicator"
                                                >
                                                    <p className="Product_List_Card_CartQtty_Indicator_Text">
                                                        {cartItems.find((item) => item.product.id === product.id)?.quantity}
                                                    </p>
                                                </m.div>
                                            )}

                                            <m.button
                                                key={"addToCart" + product.id}
                                                layout
                                                className="Product_List_Card_Edit_Btn"
                                                onClick={() => {
                                                    addToCartAction(product);
                                                    setCartOpenAction(true);
                                                }}
                                            >
                                                <span className="material-icons User_Tab_Edit_Icon">add_shopping_cart</span>
                                                <p className="User_Info_Item_Edit_Btn_Text">Adicionar ao Carrinho</p>
                                            </m.button>
                                            <m.button key={"seeMore" + product.id} layout className="Product_List_Card_Edit_Btn" onClick={() => {}}>
                                                <span className="material-icons User_Tab_Edit_Icon">more_horiz</span>
                                                <p className="User_Info_Item_Edit_Btn_Text">Mais Informações</p>
                                            </m.button>
                                        </AnimatePresence>
                                    </m.div>
                                </div>
                            </m.div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default Client_Product_List;
