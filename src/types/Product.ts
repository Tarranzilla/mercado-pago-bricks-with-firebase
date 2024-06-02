type Product = {
    id: string;
    category: string;
    type: string;
    variant: Variant;

    availableForSale: boolean;
    isPromoted: boolean;
    showInStore: boolean;

    stockQtty: number;

    title: string;
    subtitle: string;
    description: string[];
    price: number;
    weight: string;

    ingredients: ProductIngredient[];
    images: WebImg[];
    url_page_link: string;
    url_full: string;
};

export default Product;

export type Product_Category = {
    id: string;
    name: string;
    types: string[];
};

export type WebImg = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export type ProductIngredient = {
    id: string;
    name: string;
    description: string[];
};

export type Variant = {
    id: string;
    name: string;
    price: number;
    description: string;
};
