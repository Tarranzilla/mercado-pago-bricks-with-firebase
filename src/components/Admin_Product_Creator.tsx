import { useState, useEffect, useRef } from "react";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

import Product from "@/types/Product";

const product_template: Product = {
    id: "ID do Produto",
    category: "Categoria do Produto",
    type: "Tipo do Produto",
    variant: {
        id: "ID da Variante",
        name: "Nome da Variante",
        price: 0,
        description: "Descrição da Variante",
    },

    availableForSale: true,
    isPromoted: true,
    showInStore: true,
    stockQtty: 0,

    title: "Nome do Produto",
    subtitle: "Subtítulo do Produto",
    description: ["Descrição do Produto"],

    price: 0,
    weight: "Peso do Produto em Gramas",
    ingredients: [{ id: "ID do Ingrediente", name: "Nome do Ingrediente", description: ["Descrição do Ingrediente"] }],
    images: [{ src: "URL da Imagem", alt: "Texto Alternativo", width: 128, height: 128 }],
    url_page_link: "URL da Página do Produto",
    url_full: "URL da Imagem em Tamanho Completo",
};

export type Product_String_Info_Container_Props = {
    label: string;
    placeholder: string;
    product: Product;
    editedProduct: Product;
    handleProductChange: any;
};

export const Product_Title_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.title}
                        onChange={(e) => handleProductChange("title", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedProduct.title !== product.title ? `${editedProduct.title}*` : product.title}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Subtitle_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.subtitle}
                        onChange={(e) => handleProductChange("subtitle", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.subtitle !== product.subtitle ? `${editedProduct.subtitle}*` : product.subtitle}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Category_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.category}
                        onChange={(e) => handleProductChange("category", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.category !== product.category ? `${editedProduct.category}*` : product.category}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Type_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.type}
                        onChange={(e) => handleProductChange("type", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedProduct.type !== product.type ? `${editedProduct.type}*` : product.type}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Price_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="number"
                        placeholder={placeholder}
                        value={editedProduct.price}
                        onChange={(e) => handleProductChange("price", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedProduct.price !== product.price ? `${editedProduct.price}*` : product.price}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Weight_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.weight}
                        onChange={(e) => handleProductChange("weight", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedProduct.weight !== product.weight ? `${editedProduct.weight}*` : product.weight}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Description_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <textarea
                        className="User_Info_Item_Input"
                        placeholder={placeholder}
                        value={editedProduct.description.join("\n")}
                        onChange={(e) => handleProductChange("description", e.target.value.split("\n"))}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.description.join("\n") !== product.description.join("\n")
                            ? `${editedProduct.description.join("\n")}*`
                            : product.description.join("\n")}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Promotion_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="checkbox"
                        checked={editedProduct.isPromoted}
                        onChange={(e) => handleProductChange("isPromoted", e.target.checked)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.isPromoted !== product.isPromoted ? `${editedProduct.isPromoted}*` : product.isPromoted}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_ShowInStore_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="checkbox"
                        checked={editedProduct.showInStore}
                        onChange={(e) => handleProductChange("showInStore", e.target.checked)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.showInStore !== product.showInStore ? `${editedProduct.showInStore}*` : product.showInStore}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_AvailableForSale_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="checkbox"
                        checked={editedProduct.availableForSale}
                        onChange={(e) => handleProductChange("availableForSale", e.target.checked)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.availableForSale !== product.availableForSale
                            ? `${editedProduct.availableForSale}*`
                            : product.availableForSale}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_StockQtty_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="number"
                        placeholder={placeholder}
                        value={editedProduct.stockQtty}
                        onChange={(e) => handleProductChange("stockQtty", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.stockQtty !== product.stockQtty ? `${editedProduct.stockQtty}*` : product.stockQtty}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Ingredient_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.ingredients[0].name}
                        onChange={(e) =>
                            handleProductChange("ingredients", [
                                { id: "ID do Ingrediente", name: e.target.value, description: ["Descrição do Ingrediente"] },
                            ])
                        }
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.ingredients[0].name !== product.ingredients[0].name
                            ? `${editedProduct.ingredients[0].name}*`
                            : product.ingredients[0].name}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_Image_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.images[0].src}
                        onChange={(e) => handleProductChange("images", [{ src: e.target.value, alt: "Texto Alternativo", width: 128, height: 128 }])}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.images[0].src !== product.images[0].src ? `${editedProduct.images[0].src}*` : product.images[0].src}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_PageLink_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.url_page_link}
                        onChange={(e) => handleProductChange("url_page_link", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.url_page_link !== product.url_page_link ? `${editedProduct.url_page_link}*` : product.url_page_link}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const Product_FullLink_Info_Container: React.FC<Product_String_Info_Container_Props> = ({
    label,
    placeholder,
    product,
    editedProduct,
    handleProductChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedProduct.url_full}
                        onChange={(e) => handleProductChange("url_full", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedProduct.url_full !== product.url_full ? `${editedProduct.url_full}*` : product.url_full}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

const Admin_Product_Creator = () => {
    const [product, setProduct] = useState<Product>(product_template);
    const [editedProduct, setEditedProduct] = useState<Product>(product_template);

    const handleProductChange = (key: string, value: any) => {
        setEditedProduct({ ...editedProduct, [key]: value });
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
        <div className="Product_Creator">
            <div className="UserTab_Content_Wrapper Product_Creator_Content_Wrapper" ref={scroll_ref}>
                <div className="User_Tab_Card Product_Creator_Card">
                    <h1 className="User_Tab_Card_Title Product_Creator_Card_Title">Criador de Produtos | Administrador</h1>

                    {product ? (
                        <div className="User_Tab_Card_Info_Items_List">
                            <Product_Title_Info_Container
                                label="Nome"
                                placeholder="Nome do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Subtitle_Info_Container
                                label="Subtítulo"
                                placeholder="Subtítulo do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Category_Info_Container
                                label="Categoria"
                                placeholder="Categoria do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Type_Info_Container
                                label="Tipo"
                                placeholder="Tipo do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Price_Info_Container
                                label="Preço"
                                placeholder="Preço do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Weight_Info_Container
                                label="Peso"
                                placeholder="Peso do Produto em Gramas"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Description_Info_Container
                                label="Descrição"
                                placeholder="Descrição do Produto"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Promotion_Info_Container
                                label="Promovido"
                                placeholder="Promovido"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_ShowInStore_Info_Container
                                label="Mostrar na Loja"
                                placeholder="Mostrar na Loja"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_AvailableForSale_Info_Container
                                label="Disponível para Venda"
                                placeholder="Disponível para Venda"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_StockQtty_Info_Container
                                label="Quantidade em Estoque"
                                placeholder="Quantidade em Estoque"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Ingredient_Info_Container
                                label="Ingredientes"
                                placeholder="Ingredientes"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_Image_Info_Container
                                label="Imagens"
                                placeholder="Imagens"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_PageLink_Info_Container
                                label="Link da Página"
                                placeholder="Link da Página"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />

                            <Product_FullLink_Info_Container
                                label="Link Completo"
                                placeholder="Link Completo"
                                product={product}
                                editedProduct={editedProduct}
                                handleProductChange={handleProductChange}
                            />
                        </div>
                    ) : (
                        <p>Carregando ...</p>
                    )}
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

export default Admin_Product_Creator;
