import axios from "axios";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Product from "@/types/Product";

const GET_ALL_PRODUCTS_URL = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS;

if (!GET_ALL_PRODUCTS_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS environment variable is not defined");
}

type Category = {
    name: string;
    description: string;
    product_ids: string[];
};

const ProductControl = () => {
    const local_user = useSelector((state: RootState) => state.user.currentUser);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const categories = [
        {
            name: "Todos",
            description: "Todas as categorias",
            product_ids: [
                "tropical-sampa-barra",
                "tropical-rio-barra",
                "tropical-parana-barra",
                "tropical-minas-barra",
                "tropical-bahia-barra",
                "tropical-amazonas-barra",
                "mini-ovo",
                "ovo-caramelo-amendoim",
                "ovo-cookies-nutella",
                "ovo-pistache",
                "ovo-tropical-amazonas",
                "ovo-tropical-maravilha",
                "ovo-tropical-minas",
                "ovo-tropical-parana",
                "ovo-tropical-parana-amazonas",
                "ovo-tropical-rio",
                "ovo-tropical-sampa",
                "",
            ],
        },
        {
            name: "Barras Clássicas",
            description: "Barras feitas com receitas tradicionais do Brasil",
            product_ids: [
                "tropical-amazonas-barra",
                "tropical-bahia-barra",
                "tropical-minas-barra",
                "tropical-parana-barra",
                "tropical-rio-barra",
                "tropical-sampa-barra",
            ],
        },
        {
            name: "Barras Especiais",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: ["", "", ""],
        },
        {
            name: "Discos",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: ["", "", ""],
        },
        {
            name: "Bombons",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: ["", "", ""],
        },
        {
            name: "Dia dos Pais",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: ["", "", ""],
        },
        {
            name: "Dia dos Namorados",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: ["", "", ""],
        },
        {
            name: "Páscoa",
            description: "Barras feitas com ingredientes diferenciados",
            product_ids: [
                "mini-ovo",
                "ovo-caramelo-amendoim",
                "ovo-cookies-nutella",
                "ovo-pistache",
                "ovo-tropical-amazonas",
                "ovo-tropical-maravilha",
                "ovo-tropical-minas",
                "ovo-tropical-parana",
                "ovo-tropical-parana-amazonas",
                "ovo-tropical-rio",
                "ovo-tropical-sampa",
            ],
        },
    ];

    const [activeCategories, setActiveCategories] = useState<Category[]>([
        {
            name: "Todos",
            description: "Todos os nossos incríveis produtos!",
            product_ids: [
                "tropical-amazonas-barra",
                "tropical-bahia-barra",
                "tropical-minas-barra",
                "tropical-parana-barra",
                "tropical-rio-barra",
                "tropical-sampa-barra",
            ],
        },
    ]);

    const filteredProducts = products.filter((product) => {
        return activeCategories.some((category) => category.product_ids.includes(product.id));
    });

    console.log(products);
    console.log(filteredProducts);

    useEffect(() => {
        axios.get(GET_ALL_PRODUCTS_URL).then((response) => {
            setProducts(response.data);
            setLoadingProducts(false);
        });
    }, []);

    return (
        <>
            <div className="Product_Control_Card Control_Card">
                <h2 className="Control_Title">Controle de Categorias</h2>

                <div className="Category_Control_List">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`Category_Item ${activeCategories.includes(category) ? "Active" : ""}`}
                            onClick={() => {
                                if (activeCategories.includes(category)) {
                                    setActiveCategories(activeCategories.filter((activeCategory) => activeCategory !== category));
                                } else {
                                    setActiveCategories([...activeCategories, category]);
                                }
                            }}
                        >
                            <div className="Category_Item_Header">
                                <h1>{category.name}</h1>
                                <p>{category.description}</p>
                            </div>

                            <button>Editar</button>
                        </div>
                    ))}
                    <button className="Category_Item Add_Category_Btn">
                        <span className="material-icons">add_circle</span>
                        <div className="Category_Item_Header">
                            <h1>Adicionar Categoria</h1>
                            <p>Crie uma nova categoria para os seus produtos</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="Product_Control_Card Control_Card">
                <h2 className="Control_Title">Controle de Produtos</h2>
                {loadingProducts && <h1 className="Control_Loader">Carregando...</h1>}
                {!loadingProducts && products.length === 0 && <h1>Nenhum produto encontrado</h1>}
                {!loadingProducts && products.length > 0 && (
                    <div className="Product_Control_List Control_List">
                        {filteredProducts.map((product, index) => (
                            <div key={index} className="Control_Item">
                                <img src={product.images[0].src}></img>

                                <div className="Control_Item_Content">
                                    <h1>{product.title}</h1>
                                    <p>{product.description}</p>
                                    <p>R$ {product.price},00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="Product_Control_Card Control_Card">
                <h2 className="Control_Title">Criador de Produtos</h2>
            </div>
        </>
    );
};

export default ProductControl;
