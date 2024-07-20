import axios from "axios";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Product from "@/types/Product";
import Product_Category from "@/types/Product_Category";

import { motion as m, AnimatePresence } from "framer-motion";

import { set } from "firebase/database";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";

import { useFirebase } from "@/components/Firebase_Context";

const GET_ALL_PRODUCTS_URL = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS;
if (!GET_ALL_PRODUCTS_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS environment variable is not defined");
}

/* full empty product with examples

const empty_product: Product = {
    id: "",
    category: "Todos",
    type: "",
    variant: {
        id: "string",
        name: "string",
        price: 1,
        description: "",
    },

    availableForSale: true,
    isPromoted: false,
    showInStore: true,

    stockQtty: 1,

    title: "",
    subtitle: "",
    description: ["", ""],
    price: 1,
    weight: "100g",

    ingredients: [
        {
            id: "",
            name: "",
            description: ["", ""],
        },
    ],
    images: [
        {
            src: "",
            alt: "",
            width: 128,
            height: 128,
        },
    ],
    url_page_link: "",
    url_full: "",
};

*/

const empty_product: Product = {
    id: "",
    category: "Todos",
    type: "",
    variant: {
        id: "string",
        name: "string",
        price: 1,
        description: "",
    },

    availableForSale: true,
    isPromoted: false,
    showInStore: true,

    stockQtty: 1,

    title: "",
    subtitle: "",
    description: ["", ""],
    price: 1,
    weight: "100g",

    ingredients: [],
    images: [],
    url_page_link: "",
    url_full: "",
};

// const { new_product_data, user_id } = req.body; // Extracting user_id along with product category data
const CREATE_PRODUCT_URL = process.env.NEXT_PUBLIC_PATH_API_CREATE_PRODUCT;
if (!CREATE_PRODUCT_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_CREATE_PRODUCT environment variable is not defined");
}

const GET_ALL_PRODUCTS_CATEGORIES_URL = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS_CATEGORIES;
if (!GET_ALL_PRODUCTS_CATEGORIES_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_PRODUCTS_CATEGORIES environment variable is not defined");
}

// const { new_product_category_data, user_id } = req.body; // Extracting user_id along with product category data
const CREATE_PRODUCT_CATEGORY_URL = process.env.NEXT_PUBLIC_PATH_API_CREATE_PRODUCT_CATEGORY;
if (!CREATE_PRODUCT_CATEGORY_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_CREATE_PRODUCT_CATEGORY environment variable is not defined");
}

const REMOVE_PRODUCT_CATEGORY_URL = process.env.NEXT_PUBLIC_PATH_API_REMOVE_PRODUCT_CATEGORY;
if (!REMOVE_PRODUCT_CATEGORY_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_REMOVE_PRODUCT_CATEGORY environment variable is not defined");
}

const empty_category: Product_Category = {
    id: "",
    name: "",
    description: "",
    product_ids: [],
};

const categories_data = [
    {
        id: "0001",
        name: "Todos",
        description: "Todos os Produtos",
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

type FirebaseImage = {
    name: string;
    url: string;
};

const ProductControl = () => {
    const firebase = useFirebase();

    if (!firebase || !firebase.storage || !firebase.auth || !firebase.firestore) {
        throw new Error("Firebase not initialized properly");
    }

    const storageRef = ref(firebase.storage);
    console.log(storageRef);

    const projectRef = ref(storageRef, "pragmatas-shop");
    console.log(projectRef);

    const productImagesRef = ref(projectRef, "product-imgs");
    console.log(productImagesRef);

    const fetchProductImages = async () => {
        console.log("Fetching Images...");
        try {
            const res = await listAll(productImagesRef);
            if (res.prefixes.length === 0 && res.items.length === 0) {
                console.log("No prefixes or items found.");
            }
            const imageUrls = await Promise.all(
                res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    // console.log(itemRef.name, url);
                    return { name: itemRef.name, url };
                })
            );
            setProductImages(imageUrls); // Set the state once with all URLs
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    const uploadProductImage = async (file: File, name: string): Promise<Product> => {
        const fileRef = ref(productImagesRef, name);
        let newProductWithFirebaseImage;

        try {
            await uploadBytes(fileRef, file); // Upload the file to Firebase Storage
            const fileUrl = await getDownloadURL(fileRef); // Get the download URL of the uploaded file

            newProductWithFirebaseImage = {
                ...newProduct,
                images: [...newProduct.images, { src: fileUrl, alt: `Imagem do Produto ${newProduct.title}`, width: 512, height: 512 }],
            };

            setNewProduct(newProductWithFirebaseImage); // Assuming this updates some state
            console.log("File Uploaded Successfully");
        } catch (error) {
            console.error("Error uploading the file", error);
            // Handle the error appropriately
            // You might want to return null or throw the error again after logging or handling it
            throw error; // or return null;
        } finally {
            // Set uploading state to false or perform any cleanup if necessary
        }

        return newProductWithFirebaseImage; // Return the updated product outside the try-catch
    };

    const local_user = useSelector((state: RootState) => state.user.currentUser);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState<Product_Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productSearchTextInput, setProductSearchTextInput] = useState("");

    const [activeCategories, setActiveCategories] = useState<Product_Category[]>([]);

    const [newCategory, setNewCategory] = useState<Product_Category>(empty_category);
    const [creatingNewCategory, setCreatingNewCategory] = useState(false);

    const [editedCategory, setEditedCategory] = useState<Product_Category>(empty_category);
    const [editingCategory, setEditingCategory] = useState(false);

    const [newProduct, setNewProduct] = useState<Product>(empty_product);
    const [creatingNewProduct, setCreatingNewProduct] = useState(false);
    const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
    const [newProductTemporaryImageURL, setNewProductTemporaryImageURL] = useState<string | null>(null);

    const [productImages, setProductImages] = useState<FirebaseImage[]>([]);

    const [editedProduct, setEditedProduct] = useState<Product>(empty_product);
    const [editingProduct, setEditingProduct] = useState(false);

    let filteredCategories: Product_Category[] = [];
    let filteredProducts: Product[] = [];

    if (categories.length > 0) {
        console.log("Categories:", categories);
        console.log("Active Categories:", activeCategories);
        console.log("Products:", products);
        filteredCategories = activeCategories.filter((category) => {
            console.log("Filtering Category:", category.name);
            return category.product_ids.some((productId) => {
                const productExists = products.some((product) => {
                    const match = product.id === productId;
                    if (match) {
                        console.log(`Match found for ${productId} in product ${product.title}`);
                    }
                    return match;
                });
                if (!productExists) {
                    console.log(`No match found for ${productId}`);
                }
                return productExists;
            });
        });
    } else {
        filteredCategories = [];
    }
    if (products.length > 0) {
        filteredProducts = products.filter((product) => {
            // Check if product belongs to any of the filtered categories
            const isInFilteredCategory = filteredCategories.some((category) => category.product_ids.includes(product.id));
            if (!isInFilteredCategory) return false;

            // If there's a search text, further filter by matching the search text
            if (productSearchTextInput === "") return true;
            return product.title.toLowerCase().includes(productSearchTextInput.toLowerCase());
        });
    } else {
        filteredProducts = [];
    }

    const createNewCategory = (id: string, name: string, description: string, product_ids: string[]) => {
        if (!local_user) return;

        const newCategory = {
            id: id,
            name: name,
            description: description,
            product_ids: product_ids,
        };

        setCategories([...categories, newCategory]);
        axios.post(CREATE_PRODUCT_CATEGORY_URL, { new_product_category_data: newCategory, user_id: local_user.id });

        console.log("Creating new category");
    };

    const editCategory = (id: string, newName: string, newDescription: string, newProductIds: string[]) => {
        if (!local_user) return;

        const categoryIndex = categories.findIndex((category) => category.id === id);
        if (categoryIndex === -1) return;

        const editedCategory = {
            id: id,
            name: newName,
            description: newDescription,
            product_ids: newProductIds,
        };

        setCategories([...categories.slice(0, categoryIndex), editedCategory, ...categories.slice(categoryIndex + 1)]);
        axios.post(CREATE_PRODUCT_CATEGORY_URL, { new_product_category_data: editedCategory, user_id: local_user.id });

        console.log("Editing category");
    };

    const removeCategory = (id: string) => {
        if (!local_user) return;

        const categoryIndex = categories.findIndex((category) => category.id === id);
        if (categoryIndex === -1) return;

        setCategories([...categories.slice(0, categoryIndex), ...categories.slice(categoryIndex + 1)]);
        axios.post(REMOVE_PRODUCT_CATEGORY_URL, { category_id: id, user_id: local_user.id });

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

    const createNewProduct = async (product: Product) => {
        if (!local_user) return;
        console.log("Creating new product");
        let updatedProduct = product; // Initialize with the original product

        if (newProductImageFile) {
            console.log(newProductImageFile);
            // Capture the updated product after image upload
            updatedProduct = await uploadProductImage(newProductImageFile, newProductImageFile.name);
        }

        // Use updatedProduct for subsequent operations
        editCategory("todos", "Todos", "Todas as categorias", [...categories[0].product_ids, updatedProduct.id]);
        setProducts([...products, updatedProduct]); // Update state with the updated product

        console.log(updatedProduct);

        // Use updatedProduct for the Axios request
        await axios.post(CREATE_PRODUCT_URL, { new_product_data: updatedProduct, user_id: local_user.id });
        console.log("product_created");
    };

    const editProduct = (product: Product) => {
        if (!local_user) return;

        const productIndex = products.findIndex((p) => p.id === product.id);
        if (productIndex === -1) return;

        setProducts([...products.slice(0, productIndex), product, ...products.slice(productIndex + 1)]);

        axios.post(CREATE_PRODUCT_URL, { new_product_data: product, user_id: local_user.id });

        console.log("Editing product");
    };

    const removeProduct = (id: string) => {
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex === -1) return;

        setProducts([...products.slice(0, productIndex), ...products.slice(productIndex + 1)]);

        console.log("Removing product");
    };

    const handleRemoveProduct = (id: string) => {
        // Display the confirmation dialog
        const isConfirmed = window.confirm("Tem certeza que deseja excluir este produto?");

        // Check the user's response
        if (isConfirmed) {
            // User clicked 'OK', proceed with the deletion logic
            removeProduct(id);
            setEditingProduct(false);
            console.log("Produto excluído.");
        } else {
            // User clicked 'Cancel', do nothing or handle accordingly
            console.log("Ação de exclusão cancelada.");
        }
    };

    useEffect(() => {
        axios.get(GET_ALL_PRODUCTS_CATEGORIES_URL).then((response) => {
            setCategories(response.data.productsCategories);
            setLoadingCategories(false);
        });

        axios.get(GET_ALL_PRODUCTS_URL).then((response) => {
            setProducts(response.data);
            setLoadingProducts(false);
        });
    }, []);

    useEffect(() => {
        setActiveCategories(categories);
    }, [categories]);

    useEffect(() => {
        // if the products change the categories should be updated, removing any product that is not in the products list

        if (products.length === 0 || categories.length === 0) return;

        console.log("categories:", categories);

        const updatedCategories = categories.map((category) => {
            return {
                ...category,
                product_ids: category.product_ids.filter((productId) => products.some((product) => product.id === productId)),
            };
        });

        setCategories(updatedCategories);
    }, [products]);

    useEffect(() => {
        fetchProductImages();
    }, []);

    useEffect(() => {
        console.log(productImages);
    }, [productImages]);

    return (
        <>
            <div className="Product_Control_Card Control_Card">
                {productImages.length > 0 && (
                    <div className="Product_Control_Image_List">
                        {productImages.map((image, index) => (
                            <>
                                <img key={index} className="Product_Control_Image" alt={image.name} src={image.url}></img>
                            </>
                        ))}
                    </div>
                )}

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
                    {categories.length > 0 &&
                        categories.map((category, index) => (
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

                <AnimatePresence>
                    {editingProduct && (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="Add_Category_Form">
                            <div className="Add_Category_Form_Card">
                                <h3 className="Control_Form_Title">Editar Produto</h3>

                                <div className="Control_Form_Input_Header">
                                    <input
                                        className="Control_Form_Input"
                                        onChange={(e) => {
                                            setEditedProduct({ ...editedProduct, id: e.target.value });
                                        }}
                                        type="text"
                                        placeholder="Novo ID do Produto"
                                        value={editedProduct.id}
                                    />

                                    <button
                                        onClick={() => {
                                            handleRemoveProduct(editedProduct.id);
                                        }}
                                        className="Control_Form_Btn"
                                    >
                                        Excluir Produto
                                    </button>
                                </div>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setEditedProduct({ ...editedProduct, title: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Novo Título do Produto"
                                    value={editedProduct.title}
                                ></input>

                                <textarea
                                    className="Control_Form_Input Control_Form_Tall_Input"
                                    onChange={(e) => {
                                        const descriptions = e.target.value.split(/\n\n|\n/);
                                        setEditedProduct({ ...editedProduct, description: descriptions });
                                    }}
                                    placeholder="Nova Descrição do Produto"
                                    value={editedProduct.description.join("\n\n")}
                                ></textarea>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setEditedProduct({ ...editedProduct, price: parseInt(e.target.value) });
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="Novo Preço do Produto"
                                    value={editedProduct.price}
                                ></input>

                                {/* URL da Imagem Principal e das secundárias separada por virgulas */}
                                <textarea
                                    className="Control_Form_Input Control_Medium_Input"
                                    placeholder="URL das Imagens do Produto"
                                    value={editedProduct.images.map((image) => image.src).join(",")}
                                ></textarea>

                                <div className="Control_Form_Footer">
                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            setEditingProduct(false);
                                        }}
                                    >
                                        Fechar
                                    </button>

                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            editProduct(editedProduct);
                                            setEditingProduct(false);
                                        }}
                                    >
                                        Salvar Alterações no Produto
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    )}

                    {creatingNewProduct && (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="Add_Category_Form">
                            <div className="Add_Category_Form_Card">
                                <h3 className="Control_Form_Title">Criar Novo Produto</h3>

                                <div className="Control_Form_Input_Header">
                                    <input
                                        className="Control_Form_Input"
                                        onChange={(e) => {
                                            setNewProduct({ ...newProduct, id: e.target.value });
                                        }}
                                        type="text"
                                        placeholder="ID do Novo Produto (Ex: tropical-sampa-barra)"
                                    />
                                </div>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, title: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Título do Novo Produto (Ex: Barra Tropical Sampa)"
                                ></input>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, subtitle: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Subtítulo do Novo Produto (Ex: Barra de Chocolate com 70% de Cacau)"
                                ></input>

                                <textarea
                                    className="Control_Form_Input Control_Form_Tall_Input"
                                    onChange={(e) => {
                                        const descriptions = e.target.value.split(/\n\n|\n/);
                                        setNewProduct({ ...newProduct, description: descriptions });
                                    }}
                                    placeholder="Descrição do Novo Produto (Separe os parágrafos com duas quebras de linha)"
                                ></textarea>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, price: parseInt(e.target.value) });
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="Preço do Novo Produto (Ex: 10)"
                                ></input>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, weight: e.target.value });
                                    }}
                                    type="text"
                                    placeholder="Peso do Novo Produto (Ex: 100g)"
                                ></input>

                                <input
                                    className="Control_Form_Input"
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, stockQtty: parseInt(e.target.value) });
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="Quantidade em Estoque do Novo Produto (Ex: 10)"
                                ></input>

                                {/* URL da Imagem Principal e das secundárias separada por virgulas */}

                                <textarea
                                    className="Control_Form_Input Control_Medium_Input"
                                    placeholder="URL das Imagens do Produto (Separe-as com virgula, a primeira imagem será a principal."
                                    onChange={(e) => {
                                        setNewProduct({
                                            ...newProduct,
                                            images: e.target.value.split(",").map((src, index) => ({
                                                src,
                                                alt: `Imagem nº ${index + 1} de ${newProduct.title}`,
                                                width: 512,
                                                height: 512,
                                            })),
                                        });
                                    }}
                                ></textarea>

                                <div className="Product_Creation_Image_Upload_Container">
                                    <label htmlFor="product_creation_image_filepicker">
                                        <span className="material-icons">image</span>Escolha uma Imagem (GIF, PNG, JPG)
                                    </label>
                                    <input
                                        type="file"
                                        id="product_creation_image_filepicker"
                                        name="product_creation_image_filepicker"
                                        accept=".gif, .png, .jpg, .jpeg"
                                        onChange={(e) => {
                                            if (!e.target.files) {
                                                console.log("No Files Selected");
                                                return;
                                            }

                                            console.log(e.target.files);
                                            const firstFile = e.target.files[0];

                                            if (!firstFile) {
                                                console.log("No Files Selected");
                                                return;
                                            }

                                            setNewProductImageFile(firstFile);
                                            // const reader = new FileReader(); // estudar este conceito
                                            const fileTempUrl = URL.createObjectURL(firstFile);
                                            setNewProductTemporaryImageURL(fileTempUrl);
                                        }}
                                    />
                                    <div className="Product_Creation_Image_Upload_Container_Image_Preview">
                                        {newProductTemporaryImageURL && <img src={newProductTemporaryImageURL} alt="Imagem Temporária" />}
                                        {newProductImageFile && <p>{newProductImageFile.name}</p>}
                                    </div>
                                </div>

                                <div className="Control_Form_Checkbox_Group">
                                    <div className="Control_Form_Checkbox">
                                        <input
                                            type="checkbox"
                                            id="availableForSale"
                                            name="availableForSale"
                                            onChange={(e) => {
                                                setNewProduct({ ...newProduct, availableForSale: e.target.checked });
                                            }}
                                        ></input>
                                        <label htmlFor="availableForSale">Disponível para Venda</label>
                                    </div>

                                    <div className="Control_Form_Checkbox">
                                        <input
                                            type="checkbox"
                                            id="isPromoted"
                                            name="isPromoted"
                                            onChange={(e) => {
                                                setNewProduct({ ...newProduct, isPromoted: e.target.checked });
                                            }}
                                        ></input>
                                        <label htmlFor="isPromoted">Produto em Destaque</label>
                                    </div>

                                    <div className="Control_Form_Checkbox">
                                        <input
                                            type="checkbox"
                                            id="showInStore"
                                            name="showInStore"
                                            onChange={(e) => {
                                                setNewProduct({ ...newProduct, showInStore: e.target.checked });
                                            }}
                                        ></input>
                                        <label htmlFor="showInStore">Exibir na Loja</label>
                                    </div>
                                </div>

                                <div className="Control_Form_Footer">
                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            setCreatingNewProduct(false);
                                        }}
                                    >
                                        Fechar
                                    </button>

                                    <button
                                        className="Control_Form_Btn"
                                        onClick={() => {
                                            createNewProduct(newProduct)
                                                .then(() => {
                                                    // Actions to perform after createNewProduct completes
                                                    setCreatingNewProduct(false);
                                                })
                                                .catch((error) => {
                                                    // Handle any errors that occur during createNewProduct
                                                    console.error("Failed to create new product:", error);
                                                });
                                        }}
                                    >
                                        Criar Novo Produto
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {categories.length > 0 && (
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
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {loadingProducts && <h1 className="Control_Loader">Carregando...</h1>}
                {!loadingProducts && products.length === 0 && <h1>Nenhum produto encontrado</h1>}

                {!loadingProducts && products.length > 0 && (
                    <div className="Product_Control_List Control_List">
                        <button
                            onClick={() => {
                                setNewProduct(empty_product);
                                setCreatingNewProduct(true);
                            }}
                            key={"create_product_button"}
                            className="Control_Item Add_Category_Btn"
                        >
                            <span className="material-icons">add_circle</span>
                            <div className="Control_Item_Header">
                                <h1>Adicionar Produto</h1>
                                <p>Crie um novo produto para a sua loja</p>
                            </div>
                        </button>
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
                                        <button
                                            onClick={() => {
                                                setEditedProduct(product);
                                                setEditingProduct(true);
                                            }}
                                            className="Control_Item_Edit_Btn"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductControl;
