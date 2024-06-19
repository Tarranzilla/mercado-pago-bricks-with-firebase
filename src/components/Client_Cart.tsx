import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/router";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { addCartItem, removeCartItem, decrementCartItem } from "@/store/slices/cart_slice";

import Product from "@/types/Product";
import { User } from "@/types/User";
import { Cart_Item } from "@/types/Cart_Item";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

import Client_Cart_Content from "./Client_Cart_Content";

const Client_Cart = () => {
    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    return (
        <>
            <AnimatePresence>
                {isCartOpen ? (
                    <Client_Cart_Content />
                ) : (
                    <m.div
                        initial={{ x: 1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: 1000 }}
                        transition={{ duration: 0.5 }}
                        className="Cart"
                        key={"Cart_Cover_Image"}
                    >
                        <Image src="/brand_imgs/arte_minas.png" alt="Arte" width={400} height={800} className={"User_Tab_Cover_Image"} />
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Client_Cart;
