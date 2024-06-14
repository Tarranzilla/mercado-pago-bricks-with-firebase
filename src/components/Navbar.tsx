import Link from "next/link";

import { setUserTabOpen, setCartOpen } from "@/store/slices/interface_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Navbar = () => {
    const dispatch = useDispatch();

    const userTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const cartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    const toggleUserTab = () => {
        dispatch(setUserTabOpen(!userTabOpen));
    };

    const toggleCart = () => {
        dispatch(setCartOpen(!cartOpen));
    };

    return (
        <nav className="Navbar">
            <div className="Navbar_Tools">
                <button
                    className="Navbar_Tool"
                    onClick={() => {
                        toggleUserTab();
                    }}
                >
                    <p className="Navbar_Tool_Label">Conta</p>
                    <span className="material-icons">badge</span>
                </button>

                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Idioma</p>
                    <span className="material-icons">language</span>
                </button>

                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Menu</p>
                    <span className="material-icons">menu_book</span>
                </button>

                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Pesquisa</p>
                    <span className="material-icons">manage_search</span>
                </button>

                <button
                    className="Navbar_Tool"
                    onClick={() => {
                        toggleCart();
                    }}
                >
                    <p className="Navbar_Tool_Label">Carrinho</p>
                    <span className="material-icons">shopping_cart</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
