import axios from "axios";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Product from "@/types/Product";

import { motion as m, AnimatePresence } from "framer-motion";

const GET_ALL_PRODUCTS_URL = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS;
if (!GET_ALL_PRODUCTS_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS environment variable is not defined");
}

type Category = {
    id: string;
    name: string;
    description: string;
    product_ids: string[];
};

const empty_category: Category = {
    id: "",
    name: "",
    description: "",
    product_ids: [],
};

const categories_data = [
    {
        id: "0001",
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
        id: "0002",
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
        id: "0003",
        name: "Barras Especiais",
        description: "Barras feitas com ingredientes diferenciados",
        product_ids: ["", "", ""],
    },
    {
        id: "0004",
        name: "Discos",
        description: "Barras feitas com ingredientes diferenciados",
        product_ids: ["", "", ""],
    },
    {
        id: "0005",
        name: "Bombons",
        description: "Barras feitas com ingredientes diferenciados",
        product_ids: ["", "", ""],
    },
    {
        id: "0006",
        name: "Dia dos Pais",
        description: "Barras feitas com ingredientes diferenciados",
        product_ids: ["", "", ""],
    },
    {
        id: "0007",
        name: "Dia dos Namorados",
        description: "Barras feitas com ingredientes diferenciados",
        product_ids: ["", "", ""],
    },
    {
        id: "0008",
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

const ProductControl = () => {
    const local_user = useSelector((state: RootState) => state.user.currentUser);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [categories, setCategories] = useState<Category[]>(categories_data);
    const [products, setProducts] = useState<Product[]>([]);
    const [productSearchTextInput, setProductSearchTextInput] = useState("");

    const [activeCategories, setActiveCategories] = useState<Category[]>([categories_data[0]]);

    const [newCategory, setNewCategory] = useState<Category>(empty_category);
    const [creatingNewCategory, setCreatingNewCategory] = useState(false);

    const [editedCategory, setEditedCategory] = useState<Category>(empty_category);
    const [editingCategory, setEditingCategory] = useState(false);

    const filteredCategories = activeCategories.filter((category) =>
        category.product_ids.some((productId) => products.some((product) => product.id === productId))
    );

    const filteredProducts = products.filter((product) => {
        // Check if product belongs to any of the filtered categories
        const isInFilteredCategory = filteredCategories.some((category) => category.product_ids.includes(product.id));
        if (!isInFilteredCategory) return false;

        // If there's a search text, further filter by matching the search text
        if (productSearchTextInput === "") return true;
        return product.title.toLowerCase().includes(productSearchTextInput.toLowerCase());
    });

    const createNewCategory = (id: string, name: string, description: string, product_ids: string[]) => {
        const newCategory = {
            id: id,
            name: name,
            description: description,
            product_ids: product_ids,
        };

        setCategories([...categories, newCategory]);

        console.log("Creating new category");
    };

    const editCategory = (id: string, newName: string, newDescription: string, newProductIds: string[]) => {
        const categoryIndex = categories.findIndex((category) => category.id === id);
        if (categoryIndex === -1) return;

        const editedCategory = {
            id: id,
            name: newName,
            description: newDescription,
            product_ids: newProductIds,
        };

        setCategories([...categories.slice(0, categoryIndex), editedCategory, ...categories.slice(categoryIndex + 1)]);

        console.log("Editing category");
    };

    const removeCategory = (id: string) => {
        const categoryIndex = categories.findIndex((category) => category.id === id);
        if (categoryIndex === -1) return;

        setCategories([...categories.slice(0, categoryIndex), ...categories.slice(categoryIndex + 1)]);

        console.log("Removing category");
    };

    const handleRemove = (id: string) => {
        // Display the confirmation dialog
        const isConfirmed = window.confirm("Tem certeza que deseja excluir esta categoria?");

        // Check the user's response
        if (isConfirmed) {
            // User clicked 'OK', proceed with the deletion logic
            removeCategory(id);
            setEditingCategory(false);
            console.log("Categoria excluída.");
            // Add your deletion logic here
        } else {
            // User clicked 'Cancel', do nothing or handle accordingly
            console.log("Ação de exclusão cancelada.");
        }
    };

    //console.log(products);
    //console.log(filteredProducts);

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

                <AnimatePresence>
                    {creatingNewCategory && (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="Add_Category_Form">
                            <div className="Add_Category_Form_Card">
                                <h3 className="Control_Form_Title">Criar Nova Categoria</h3>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewCategory({ ...newCategory, id: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="ID da Categoria"
                                />
                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewCategory({ ...newCategory, name: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Nome da Categoria"
                                ></input>
                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewCategory({ ...newCategory, description: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Descrição da Categoria"
                                ></input>
                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewCategory({ ...newCategory, product_ids: e.target.value.split(",") });
                                    }}
                                    type="text"
                                    placeholder="ID dos Produtos, Separados por Vírgulas"
                                ></input>

                                <div className="Control_Form_Footer">
                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            setCreatingNewCategory(false);
                                        }}
                                    >
                                        Fechar
                                    </button>

                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            createNewCategory(newCategory.id, newCategory.name, newCategory.description, newCategory.product_ids);
                                            setCreatingNewCategory(false);
                                        }}
                                    >
                                        Adicionar Categoria
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    )}

                    {editingCategory && (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="Add_Category_Form">
                            <div className="Add_Category_Form_Card">
                                <h3 className="Control_Form_Title">Editar Categoria</h3>

                                <div className="Control_Form_Input_Header">
                                    <input
                                        className="Control_Form_Input"
                                        onChange={(e) => {
                                            setEditedCategory({ ...editedCategory, id: e.target.value });
                                        }}
                                        type="text"
                                        placeholder="Novo ID da Categoria"
                                        value={editedCategory.id}
                                    />

                                    <button
                                        onClick={() => {
                                            handleRemove(editedCategory.id);
                                        }}
                                        className="Control_Form_Btn"
                                    >
                                        Excluir Categoria
                                    </button>
                                </div>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setEditedCategory({ ...editedCategory, name: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Novo Nome da Categoria"
                                    value={editedCategory.name}
                                ></input>
                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setEditedCategory({ ...editedCategory, description: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Nova Descrição da Categoria"
                                    value={editedCategory.description}
                                ></input>
                                <textarea
                                    className="Control_Form_Input Control_Form_Tall_Input"
                                    onChange={(e) => {
                                        setEditedCategory({ ...editedCategory, product_ids: e.target.value.split(",") });
                                    }}
                                    placeholder="ID dos Produtos, Separados por Vírgulas"
                                    value={editedCategory.product_ids}
                                ></textarea>

                                <div className="Control_Form_Footer">
                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            setEditingCategory(false);
                                        }}
                                    >
                                        Fechar
                                    </button>

                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            editCategory(
                                                editedCategory.id,
                                                editedCategory.name,
                                                editedCategory.description,
                                                editedCategory.product_ids
                                            );
                                            setEditingCategory(false);
                                        }}
                                    >
                                        Salvar Alterações na Categoria
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

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
                                <h3>{category.product_ids.length} Produtos</h3>
                            </div>

                            <button
                                onClick={() => {
                                    setEditedCategory(category);
                                    setEditingCategory(true);
                                }}
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                    <button
                        className="Category_Item Add_Category_Btn"
                        onClick={() => {
                            setCreatingNewCategory(true);
                        }}
                    >
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
                <div className="Product_Control_Filter Control_Filter">
                    <h2 className="Control_Filter_Title">Filtro</h2>
                    <input
                        className="Control_Text_Filter"
                        type="text"
                        placeholder="Pesquisar produtos"
                        onChange={(e) => {
                            setProductSearchTextInput(e.target.value);
                        }}
                    ></input>
                    <select
                        className="Control_Select_Filter"
                        onChange={(e) => {
                            const findCategory = categories.find((category) => category.name === e.target.value);
                            setActiveCategories(findCategory ? [findCategory] : []);
                        }}
                    >
                        <option value="active">Disponíveis</option>
                        <option value="inactive">Indisponíveis</option>
                        <option value="discount">Com desconto</option>
                        <option value="no_discount">Sem desconto</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {loadingProducts && <h1 className="Control_Loader">Carregando...</h1>}
                {!loadingProducts && products.length === 0 && <h1>Nenhum produto encontrado</h1>}
                {!loadingProducts && products.length > 0 && (
                    <div className="Product_Control_List Control_List">
                        {filteredProducts.map((product, index) => (
                            <div key={index} className="Control_Item">
                                <img className="Control_Item_Image" src={product.images[0].src}></img>

                                <div className="Control_Item_Content">
                                    <h5 className="Control_Item_Id">#{product.id}</h5>
                                    <h1 className="Control_Item_Title">{product.title}</h1>

                                    <div className="Control_Item_Categories">
                                        {categories
                                            .filter((category) => category.product_ids.includes(product.id))
                                            .map((category, index) => (
                                                <p key={index} className="Control_Item_Category">
                                                    {category.name}
                                                </p>
                                            ))}
                                    </div>

                                    <p className="Control_Item_Description">{product.description}</p>

                                    <div className="Control_Item_Footer">
                                        <p className="Control_Item_Price">R$ {product.price},00</p>
                                        <button className="Control_Item_Edit_Btn">Editar</button>
                                    </div>
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
