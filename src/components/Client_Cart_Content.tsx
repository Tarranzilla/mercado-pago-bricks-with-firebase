import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/router";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { addCartItem, removeCartItem, decrementCartItem } from "@/store/slices/cart_slice";
import { setCartOpen, setUserTabOpen } from "@/store/slices/interface_slice";

import Product from "@/types/Product";
import { User } from "@/types/User";
import { Cart_Item } from "@/types/Cart_Item";

// Framer motion para animações
import { motion as m, AnimatePresence, LayoutGroup, useScroll, useSpring } from "framer-motion";

const Client_Cart_Content = () => {
    const router = useRouter();

    const isCheckoutPage = router.pathname.startsWith("/checkout");

    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems as Cart_Item[]);
    const customer = useSelector((state: RootState) => state.user.currentUser as User);
    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    const anonymousCustomer = customer === null || customer.name === "Usuário Anônimo";
    const cartEmpty = cartItems.length < 1;

    const setCartOpenAction = (open: boolean) => {
        dispatch(setCartOpen(open));
    };

    const setUserTabOpenAction = (open: boolean) => {
        dispatch(setUserTabOpen(open));
    };

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
        <>
            <m.div initial={{ x: "100vw" }} animate={{ x: 0 }} exit={{ x: "100vw" }} transition={{ duration: 0.5 }} className="Cart" key={"Cart"}>
                <div className="Cart_Content_Scroller" ref={scroll_ref}>
                    <div className="User_Tab_Content_Wrapper">
                        <h1 className="Cart_Title">Carrinho</h1>
                        <button
                            className="Cart_Close_Btn"
                            onClick={() => {
                                setCartOpenAction(false);
                            }}
                        >
                            <span className="material-icons">close</span>
                        </button>

                        {cartItems.length > 0 && (
                            <m.div className="Cart_List" layout layoutRoot>
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((cart_item, index) => {
                                        return (
                                            <m.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                layout
                                                className="Cart_Item"
                                                key={index + cart_item.product.id}
                                            >
                                                <div className="Cart_Item_Image_Container">
                                                    {cart_item.product.images && cart_item.product.images.length > 0 && (
                                                        <img
                                                            className="Cart_Item_Image"
                                                            src={cart_item.product.images[0].src}
                                                            alt={cart_item.product.images[0].alt}
                                                            width={128}
                                                            height={128}
                                                        />
                                                    )}
                                                </div>
                                                <div className="Cart_Item_Info">
                                                    <div className="Cart_Info_Header">
                                                        <h3 className="Cart_Item_Title">{cart_item.product.title}</h3>
                                                        <p className="Cart_Item_Price">R$ {cart_item.product.price},00</p>
                                                    </div>
                                                    <div className="Cart_Item_Quantity_Selector">
                                                        <button
                                                            className="Cart_Item_Remove_Btn"
                                                            onClick={() => {
                                                                removeCartItemAction(cart_item.product);
                                                            }}
                                                        >
                                                            <p className="Cart_Item_Remove_Btn_Text">Remover</p>
                                                        </button>
                                                        <button
                                                            className="Cart_Item_Decrement_Btn"
                                                            onClick={() => {
                                                                decrementCartItemAction(cart_item.product);
                                                            }}
                                                        >
                                                            <span className="material-icons">do_not_disturb_on</span>
                                                        </button>

                                                        <h3 className="Cart_Item_Quantity_Ammount">{cart_item.quantity}</h3>

                                                        <button
                                                            className="Cart_Item_Increment_Btn"
                                                            onClick={() => {
                                                                addCartItemAction(cart_item.product);
                                                            }}
                                                        >
                                                            <span className="material-icons">add_circle</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </m.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </m.div>
                        )}

                        {cartItems.length < 1 && (
                            <div className="No_Cart_Items">
                                <span className="material-icons">remove_shopping_cart</span>
                                <p className="No_Cart_Items_Text">Nenhum item adicionado ao carrinho.</p>
                            </div>
                        )}

                        <div className="Cart_Footer">
                            <div className="Cart_Footer_Total">
                                <h3 className="Cart_Footer_Total_Title">Valor Total dos Produtos</h3>
                                <p className="Cart_Footer_Total_Value">
                                    R$ {cartItems.length > 0 ? cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : "0"}
                                    ,00
                                </p>
                            </div>

                            <div className="Cart_Footer_Buttons_Container">
                                {isCheckoutPage ? (
                                    <>
                                        <button className="Cart_Footer_Checkout_Button Disabled Alt_Cursor">
                                            <span className="material-icons">receipt_long</span>Você Está Finalizando Esta Compra
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {anonymousCustomer && (
                                            <button
                                                className="Cart_Footer_Warning"
                                                onClick={() => {
                                                    setUserTabOpenAction(true);
                                                }}
                                            >
                                                <span className="material-icons">badge</span>
                                                <p className="Cart_Footer_Warning_Text">Crie uma conta ou conecte-se para finalizar a compra</p>
                                            </button>
                                        )}

                                        {!anonymousCustomer && (
                                            <button
                                                className={
                                                    anonymousCustomer || cartEmpty
                                                        ? "Cart_Footer_Checkout_Button Disabled"
                                                        : "Cart_Footer_Checkout_Button"
                                                }
                                                onClick={() => {
                                                    if (!anonymousCustomer && !cartEmpty) {
                                                        router.push("/checkout");
                                                    }
                                                }}
                                            >
                                                {cartEmpty && <span className="material-icons">shopping_cart</span>}
                                                <p className="Cart_Footer_Checkout_Button_Text">
                                                    {cartEmpty ? "Adicione itens ao carrinho para poder finalizar a compra" : "Finalizar Compra"}
                                                </p>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barra de Progresso de Scroll */}
                <div className="Progress_Bar_Container" key={"Cart_PB_Container"}>
                    <div className="Progress_Bar_Wrapper" key={"Cart_PB_Wrapper"}>
                        <m.div className="Progress_Bar" key={"Cart_PB"} style={{ scaleX }} />
                    </div>
                </div>
            </m.div>
        </>
    );
};

export default Client_Cart_Content;
