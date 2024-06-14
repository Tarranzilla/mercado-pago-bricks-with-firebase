import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="Navbar">
            <div className="Navbar_Tools">
                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Idioma</p>
                    <span className="material-icons">language</span>
                </button>
                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Conta</p>
                    <span className="material-icons">badge</span>
                </button>
                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Carrinho</p>
                    <span className="material-icons">shopping_cart</span>
                </button>
                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Pesquisa</p>
                    <span className="material-icons">manage_search</span>
                </button>
                <button className="Navbar_Tool">
                    <p className="Navbar_Tool_Label">Menu</p>
                    <span className="material-icons">menu_book</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;