import Product from "@/types/Product";
import { Product_Category } from "@/types/Product";

export const productCategories: Product_Category[] = [
    {
        key: "pascoa",
        name: "Páscoa",
        types: ["Ovos Trufados", "Ovos com Lascas", "Mini Ovos"],
    },
    {
        key: "classicos",
        name: "Clássicos",
        types: ["Barras"],
    },
];
export const productTypes: string[] = ["Ovos Trufados", "Ovos com Lascas", "Mini Ovos"];

const productList: Product[] = [
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-caramelo-amendoim",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Caramelo com Amendoim",
        subtitle: "Chocolate 55% intenso ao leite com recheio de caramelo com amendoim.",
        description: ["Chocolate 55% intenso ao leite com recheio de caramelo com amendoim."],
        price: 103.0,
        weight: "400g",
        ingredients: [
            { key: "chocolate", name: "Cacau Orgânico", description: ["Proveniente de produtores certificados."] },
            { key: "caramelo", name: "Caramelo", description: ["Feito artesanalmente."] },
            { key: "amendoim", name: "Amendoim", description: ["Tostados com açúcar e sal."] },
        ],
        imgSrc: [
            {
                src: "/product_imgs/ovo_caramelo_com_amendoim.jpg",
                alt: "Ovo Caramelo com Amendoim",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/ovo-caramelo-amendoim",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-pistache",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Pistache",
        subtitle: "Chocolate branco com pedaços de pistache torrado é nosso recheio exclusivo de creme de pistache.",
        description: ["Chocolate branco com pedaços de pistache torrado é nosso recheio exclusivo de creme de pistache."],
        price: 193.0,
        weight: "400g",
        ingredients: [
            {
                key: "cacau",
                name: "Cacau Orgânico",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "pistache",
                name: "Pistache",
                description: ["Torrado e moído."],
            },
        ],
        imgSrc: [
            {
                src: "/product_imgs/ovo_pistache.jpg",
                alt: "Ovo Pistache",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/ovo-pistache",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-minas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Minas",
        subtitle: "Chocolate branco 35% caramelizado com notas de doce de leite, acompanha lascas do mesmo chocolate com castanha de caju.",
        description: ["Chocolate branco 35% caramelizado com notas de doce de leite, acompanha lascas do mesmo chocolate com castanha de caju."],
        price: 90.0,
        weight: "300g",
        ingredients: [
            {
                key: "chocolate",
                name: "Cacau Orgânico",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "doce-de-leite",
                name: "Doce de Leite",
                description: ["Feito artesanalmente."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
        ],
        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_minas.jpg",
                alt: "Ovo Tropical Minas",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/ovo-tropical-minas",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "mini-ovo",
        type: "Mini Ovos",
        category: "Páscoa",
        title: "Mini Ovo",
        subtitle: "Cada mini ovo acompanha duas mini barrinhas de chocolate do mesmo sabor.",
        description: ["Cada mini ovo acompanha duas mini barrinhas de chocolate do mesmo sabor.", "Disponível em todos os sabores clássicos."],
        price: 35.0,
        weight: "120g",
        ingredients: [
            {
                key: "chocolate",
                name: "Cacau Orgânico",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "variados",
                name: "Variados",
                description: ["Leite, Doce de Leite e Café."],
            },
        ],
        imgSrc: [
            {
                src: "/product_imgs/ovo_mini.jpg",
                alt: "Mini Ovo",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/mini-ovo",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-cookies-nutella",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Cookies com Nutella",
        subtitle: "Chocolate branco com crocante de cookies e recheio de nutella.",
        description: ["Chocolate branco com crocante de cookies e recheio de nutella."],
        price: 138.0,
        weight: "400g",
        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "cookies",
                name: "Cookies",
                description: ["Feitos artesanalmente."],
            },
            {
                key: "nutella",
                name: "Nutella",
                description: ["Cremosa e Rica em Sabor."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_cookies_nutela.jpg",
                alt: "Ovo Cookies com Nutella",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/ovo-cookies-nutella",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-maravilha",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Tropical Maravilha",
        subtitle: "Chocolate ao leite com recheio cremoso sabor chocolate, com suave crocancia de pedaços de wafer recheado.",
        description: ["Chocolate ao leite com recheio cremoso sabor chocolate, com suave crocancia de pedaços de wafer recheado."],
        price: 155.0,
        weight: "400g",
        ingredients: [
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "recheio-cremoso",
                name: "Recheio cremoso sabor chocolate",
                description: ["Feito artesanalmente."],
            },
            {
                key: "wafer-recheado",
                name: "Pedaços de wafer recheado",
                description: ["Feitos artesanalmente."],
            },
        ],
        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_maravilha.jpg",
                alt: "Ovo Tropical Maravilha",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/ovo-tropical-maravilha",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-amazonas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Amazonas",
        subtitle: "Chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",

        ingredients: [
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_amazonas.jpg",
                alt: "Ovo Tropical Amazonas",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/ovo-tropical-amazonas",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-parana-amazonas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Paraná + Amazonas",
        subtitle:
            "Metade chocolate branco 35% e a outra metade chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: [
            "Metade chocolate branco 35% e a outra metade chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        ],
        price: 90.0,
        weight: "300g",

        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_parana_amazonas.jpg",
                alt: "Ovo Tropical Paraná + Amazonas",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/ovo-tropical-parana-amazonas",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-parana",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Paraná",
        subtitle: "Chocolate branco 35%, acompanha lascas do mesmo chocolate com castanha de caju.",
        description: ["Chocolate branco 35%, acompanha lascas do mesmo chocolate com castanha de caju."],
        price: 90.0,
        weight: "300g",

        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_parana.jpg",
                alt: "Ovo Tropical Paraná",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/ovo-tropical-parana",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-rio",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Rio",
        subtitle: "Chocolate intenso ao leite 55% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate intenso ao leite 55% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",

        ingredients: [
            {
                key: "chocolate-intenso",
                name: "Chocolate intenso ao leite 55%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_rio.jpg",
                alt: "Ovo Tropical Rio",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/ovo-tropical-rio",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "ovo-tropical-sampa",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Sampa",
        subtitle: "Chocolate ao leite 40% cacau com café, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate ao leite 40% cacau com café, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",

        ingredients: [
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite 40% cacau com café",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/ovo_tropical_sampa.jpg",
                alt: "Ovo Tropical Sampa",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/ovo-tropical-sampa",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-amazonas-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Amazonas",
        subtitle: "Chocolate ao leite 45% cacau, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate ao leite 45% cacau, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite 45%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_amazonas_thumb.png",
                alt: "Barra Tropical Amazonas",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/tropical-amazonas-barra",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-rio-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Rio",
        subtitle: "Chocolate intenso ao leite 55% cacau, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate intenso ao leite 55% cacau, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-intenso",
                name: "Chocolate intenso ao leite 55%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_rio_thumb.png",
                alt: "Barra Tropical Rio",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/tropical-rio-barra",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-minas-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Minas",
        subtitle: "Chocolate branco 35%, com doce de leite e castanha de caju.",
        description: ["Barra de Chocolate branco 35%, com doce de leite e castanha de caju."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco 35%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "doce-de-leite",
                name: "Doce de Leite",
                description: ["Feito artesanalmente."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_minas_thumb.png",
                alt: "Barra Tropical Minas",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/tropical-minas-barra",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-sampa-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Sampa",
        subtitle: "Chocolate ao leite 40% cacau com café, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate ao leite 40% cacau com café, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-ao-leite",
                name: "Chocolate ao leite 40% cacau com café",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
            {
                key: "castanha-do-para",
                name: "Castanha do Pará",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_sampa_thumb.png",
                alt: "Barra Tropical Sampa",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/tropical-sampa-barra",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-bahia-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Bahia",
        subtitle: "Chocolate branco 35% com coco e castanha de caju.",
        description: ["Barra de Chocolate branco 35% com coco e castanha de caju."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco 35%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "coco",
                name: "Coco",
                description: ["Raspas de coco."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_bahia_thumb.png",
                alt: "Barra Tropical Bahia",
                width: 400,
                height: 400,
            },
        ],
        pageLink: "/chocolates/tropical-bahia-barra",
    },
    {
        isPromoted: true,
        availableForSale: true,
        showInStore: true,

        stockQtty: 10,

        key: "tropical-parana-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Paraná",
        subtitle: "Chocolate branco 35% com castanha de caju.",
        description: ["Barra de Chocolate branco 35% com castanha de caju."],
        price: 40.0,
        weight: "100g",

        ingredients: [
            {
                key: "chocolate-branco",
                name: "Chocolate branco 35%",
                description: ["Proveniente de produtores certificados."],
            },
            {
                key: "castanha-de-caju",
                name: "Castanha de Caju",
                description: ["Torrada e moída."],
            },
        ],

        imgSrc: [
            {
                src: "/product_imgs/produto_tropical_parana_thumb.png",
                alt: "Barra Tropical Paraná",
                width: 400,
                height: 400,
            },
        ],

        pageLink: "/chocolates/tropical-parana-barra",
    },
];

export default productList;
