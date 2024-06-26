import Link from "next/link";

import { useEffect, useState } from "react";

import { setUserTabOpen, setCartOpen, toggleColorMode } from "@/store/slices/interface_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { useMediaQuery } from "react-responsive";

import { motion as m, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const dispatch = useDispatch();

    const isMediumScreen = useMediaQuery({
        query: "(max-width: 1480px)",
    });

    const isSmallScreen = useMediaQuery({
        query: "(max-width: 768px)",
    });

    const colorMode = useSelector((state: RootState) => state.interface.colorMode);

    const toggleColorModeAction = () => {
        dispatch(toggleColorMode());
    };

    const userTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const cartOpen = useSelector((state: RootState) => state.interface.isCartOpen);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const uniqueCartItems = cartItems.length;

    const toggleUserTab = () => {
        dispatch(setUserTabOpen(!userTabOpen));
        if (isMediumScreen) {
            dispatch(setCartOpen(false));
        }
    };

    const toggleCart = () => {
        dispatch(setCartOpen(!cartOpen));
        if (isMediumScreen) {
            dispatch(setUserTabOpen(false));
        }
    };

    let navbarClass = "Navbar";
    if (userTabOpen && !cartOpen && !isSmallScreen) {
        navbarClass += " Right";
    } else if (cartOpen && !userTabOpen && !isSmallScreen) {
        navbarClass += " Left";
    } else if (userTabOpen && cartOpen && !isSmallScreen) {
        navbarClass = "Navbar";
    }

    useEffect(() => {
        // console.log(colorMode);
        if (colorMode === "light") {
            document.body.classList.remove("darkmode");
        } else {
            document.body.classList.add("darkmode");
        }
    }, [colorMode]);

    return (
        <nav className={navbarClass}>
            <div className="Navbar_Main_Container">
                <h1 className="Navbar_Brand_Name">tropical cacau</h1>
                <div className="Navbar_Tools">
                    <button
                        className={userTabOpen ? "Navbar_Tool Active" : "Navbar_Tool"}
                        onClick={() => {
                            toggleUserTab();
                        }}
                    >
                        <p className="Navbar_Tool_Label">Conta</p>
                        <span className="material-icons">badge</span>
                    </button>

                    <button
                        className="Navbar_Tool"
                        onClick={() => {
                            toggleColorModeAction();
                        }}
                    >
                        <p className="Navbar_Tool_Label">Menu</p>
                        <span className="material-icons">menu_book</span>
                    </button>

                    <Link href="/" className="Navbar_Tool">
                        <p className="Navbar_Tool_Label">Página Inicial</p>
                        <span className="material-icons">home</span>
                    </Link>

                    <button className="Navbar_Tool">
                        <p className="Navbar_Tool_Label">Pesquisa</p>
                        <span className="material-icons">manage_search</span>
                    </button>

                    <button
                        className={cartOpen ? "Navbar_Tool Active" : "Navbar_Tool"}
                        onClick={() => {
                            toggleCart();
                        }}
                    >
                        <p className="Navbar_Tool_Label">Carrinho</p>
                        <span className="material-icons">shopping_cart</span>

                        <AnimatePresence>
                            {totalCartItems > 0 && (
                                <m.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="Cart_Items_Indicator"
                                >
                                    <p>{totalCartItems}</p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
