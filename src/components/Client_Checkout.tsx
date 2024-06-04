import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { motion as m, useScroll, useSpring } from "framer-motion";

import { User } from "@/types/User";
import { Cart_Item } from "@/types/Cart_Item";
import { Order } from "@/types/Order";

const Client_Checkout = () => {
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const customer = useSelector((state: RootState) => state.user.currentUser);

    const [receiveOption, setReceiveOption] = useState<"Retirada" | "Entrega">("Retirada");
    const shipping_cost = receiveOption === "Retirada" ? 0 : 15;
    const [receiveObservation, setReceiveObservation] = useState<string>("");
    const [tempOrder, setTempOrder] = useState<Order | null>(null);

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            setTempOrder(null);
            return;
        }

        const newOrder: Order = {
            order_preference_id: "",
            order_external_reference: "",

            order_items: cartItems,
            shipping_option: receiveOption,
            observation: receiveObservation,

            order_date: new Date(),
            order_type: "Client",
            shipping_cost: 0,
            total: cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
            customer_ref: customer.id,
            customer_name: customer.name,
            customer_adress: `${customer.address.street}, ${customer.address.number}, ${customer.address.complement}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`,
            customer_phone: customer.telephone,
            customer_type: "Client",
            status: {
                confirmed_by_admin: false,
                waiting_payment: false,
                in_production: false,
                waiting_for_retrieval: false,
                retrieved: false,
                waiting_for_delivery: false,
                delivered: false,
                cancelled: false,
            },
        };

        setTempOrder(newOrder);
    }, [cartItems, receiveOption, receiveObservation, customer]);

    return (
        <>
            <div className="Checkout">
                <div className="UserTab_Content_Wrapper Checkout_Content_Wrapper" ref={scroll_ref}>
                    {customer.name === "Usuário Anônimo" ? (
                        <div className="User_Tab_Card Checkout_Card">
                            <h1 className="User_Tab_Card_Title Checkout_Card_Title">Finalizar Compra</h1>

                            <div className="User_No_Orders">
                                <span className="material-icons User_No_Orders_Icon">badge</span>
                                <p className="User_No_Orders_Text">
                                    Você precisa estar conectado na sua conta para fazer um pedido e finalizar a compra.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="User_Tab_Card Checkout_Card">
                                <h1 className="User_Tab_Card_Title Checkout_Card_Title">Itens do Pedido</h1>
                                <div className="Checkout_Product_List">
                                    <div className="User_Order_Product_List">
                                        <h4>Produtos</h4>
                                        {cartItems.map((cart_item, index) => {
                                            return (
                                                <div key={index} className="User_Order_Product">
                                                    <p className="User_Order_Product_Title">{cart_item.product.title}</p>
                                                    <p className="User_Order_Product_Qtty">{cart_item.quantity}x</p>
                                                    <p className="User_Order_Product_Price">R$ {cart_item.product.price},00</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="User_Order_Total">
                                        <h4>Valor do Produtos</h4>
                                        <p className="User_Order_Total_Value">
                                            R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)},00
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="User_Tab_Card Checkout_Card">
                                <h1 className="User_Tab_Card_Title Checkout_Card_Title">Opções de Recebimento</h1>
                                <div className="Checkout_Receive_Options">
                                    <div
                                        className={receiveOption === "Retirada" ? "Receive_Option Active" : "Receive_Option"}
                                        onClick={() => {
                                            const element = document.getElementById("receive_option_1");
                                            if (element) element.click();
                                            setReceiveOption("Retirada");
                                        }}
                                    >
                                        <span className="material-icons">store</span>
                                        <label htmlFor="receive_option_1">Retirada na Loja</label>
                                        <a
                                            className="Recieve_Option_Map_Link"
                                            href="https://www.google.com.br/maps/preview"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <span className="material-icons">explore</span>
                                            Veja o Endereço
                                        </a>
                                        <input type="radio" name="receive_option" id="receive_option_1" defaultChecked />
                                    </div>
                                    <div
                                        className={receiveOption === "Entrega" ? "Receive_Option Active" : "Receive_Option"}
                                        onClick={() => {
                                            const element = document.getElementById("receive_option_2");
                                            if (element) element.click();
                                            setReceiveOption("Entrega");
                                        }}
                                    >
                                        <span className="material-icons">local_shipping</span>
                                        <label htmlFor="receive_option_2">Entrega em Casa</label>
                                        <input type="radio" name="receive_option" id="receive_option_2" />
                                    </div>

                                    {receiveOption === "Entrega" && (
                                        <>
                                            <div className="User_Order_Shipping_Address">
                                                <div className="User_Order_Shipping_Address_Header">
                                                    <h4>Endereço de Entrega</h4>
                                                    <button className="User_Order_Shipping_Address_Edit_Btn">
                                                        <span className="material-icons">edit</span>Alterar
                                                    </button>
                                                </div>

                                                <p>
                                                    {customer.address.street}, {customer.address.number}, {customer.address.complement}
                                                </p>
                                                <p>
                                                    {customer.address.city}, {customer.address.state}, {customer.address.zip}
                                                </p>
                                            </div>
                                            <div className="User_Order_Shipping_Info">
                                                <span className="material-icons">info</span>
                                                <p>
                                                    Para envios fora da cidade de Curitiba taxas adicionais serão cobradas - Após a finalização da
                                                    compra entraremos em contato para lhe repassar o valor extra necessário e combinar uma data.
                                                </p>
                                            </div>
                                            <div className="User_Order_Total User_Shipping_Total">
                                                <h4>Valor da Entrega</h4>
                                                <p className="User_Order_Total_Value">R$ {shipping_cost},00</p>
                                            </div>
                                        </>
                                    )}

                                    <div className="Recieve_Option_Observation">
                                        <h4>Observações</h4>
                                        <textarea
                                            id="receive_option_observation_text_area"
                                            maxLength={512}
                                            onChange={() => {
                                                const element = document.getElementById(
                                                    "receive_option_observation_text_area"
                                                ) as HTMLTextAreaElement;
                                                if (element) setReceiveObservation(element.value);
                                            }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="User_Tab_Card">
                                <h1 className="User_Tab_Card_Title Checkout_Card_Title">Resumo do Pedido</h1>
                                <div className="Checkout_Order_Summary">
                                    <div className="User_Order_Total">
                                        <h4>Valor do Produtos</h4>
                                        <p className="User_Order_Total_Value">
                                            R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)},00
                                        </p>
                                    </div>
                                    <div className="User_Order_Total User_Shipping_Total">
                                        <h4>Valor da Entrega</h4>
                                        <p className="User_Order_Total_Value">R$ {shipping_cost},00</p>
                                    </div>
                                    <div className="User_Order_Total User_Final_Total">
                                        <h4>Valor Total</h4>
                                        <p className="User_Order_Total_Value">
                                            R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + shipping_cost},00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Barra de Progresso de Scroll */}
                <div className="Progress_Bar_Container">
                    <div className="Progress_Bar_Wrapper">
                        <m.div className="Progress_Bar" style={{ scaleX }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Client_Checkout;
