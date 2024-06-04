import { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { addCartItem, removeCartItem, decrementCartItem } from "@/store/slices/cart_slice";

import Product from "@/types/Product";
import { Cart_Item } from "@/types/Cart_Item";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

const Client_Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems as Cart_Item[]);

    const addCartItemAction = (product: Product) => {
        dispatch(addCartItem({ product: product }));
    };

    const removeCartItemAction = (product: Product) => {
        dispatch(removeCartItem({ product: product }));
    };

    const decrementCartItemAction = (product: Product) => {
        dispatch(decrementCartItem({ product: product }));
    };

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div className="Cart">
            <div className="UserTab_Content_Wrapper Cart_Content_Wrapper" ref={scroll_ref}>
                <div className="User_Tab_Card Card_Card">
                    <h1 className="User_Tab_Card_Title Cart_Card_Title">Carrinho</h1>
                    <div className="Cart_List">
                        {cartItems.length > 0 &&
                            cartItems.map((cart_item, index) => {
                                return (
                                    <div className="Cart_Item Product_List_Card" key={index}>
                                        <div className="Product_List_Card_Image_Container">
                                            {cart_item.product.images && cart_item.product.images.length > 0 && (
                                                <img
                                                    className="Product_List_Card_Image"
                                                    src={cart_item.product.images[0].src}
                                                    alt={cart_item.product.images[0].alt}
                                                    width={128}
                                                    height={128}
                                                />
                                            )}
                                        </div>
                                        <div className="Product_List_Card_Info">
                                            <div className="Product_List_Card_Info_Header">
                                                <h2>{cart_item.product.title}</h2>
                                                <p className="Product_List_Card_Price">R$ {cart_item.product.price},00</p>
                                            </div>
                                            <p>{cart_item.product.description}</p>
                                            <div className="Cart_Item_Quantity_Selector">
                                                <button
                                                    className="Cart_Item_Button"
                                                    onClick={() => {
                                                        removeCartItemAction(cart_item.product);
                                                    }}
                                                >
                                                    <p className="User_Info_Item_Edit_Btn_Text">Remover</p>
                                                </button>
                                                <button
                                                    className="Cart_Item_Button"
                                                    onClick={() => {
                                                        decrementCartItemAction(cart_item.product);
                                                    }}
                                                >
                                                    <span className="material-icons">do_not_disturb_on</span>
                                                </button>

                                                <h3 className="Cart_Item_Quantity_Ammount">{cart_item.quantity}</h3>

                                                <button
                                                    className="Cart_Item_Button"
                                                    onClick={() => {
                                                        addCartItemAction(cart_item.product);
                                                    }}
                                                >
                                                    <span className="material-icons">add_circle</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {cartItems.length < 1 && <p>Nenhum Item Adicionado ao Carrinho!</p>}
                    </div>

                    <div className="Cart_Footer">
                        <div className="Cart_Footer_Total">
                            <h2 className="Cart_Footer_Total_Title">Total</h2>
                            <p className="Cart_Footer_Total_Value">
                                R$ {cartItems.length > 0 ? cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : "0"}
                                ,00
                            </p>
                        </div>
                        <button className="Cart_Footer_Checkout_Button">
                            <p className="User_Info_Item_Edit_Btn_Text">Finalizar Compra</p>
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

export default Client_Cart;
