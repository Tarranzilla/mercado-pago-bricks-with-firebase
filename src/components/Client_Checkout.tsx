import { useState, useEffect, useRef } from "react";

const Client_Checkout = () => {
    return (
        <div className="Checkout">
            <div className="UserTab_Content_Wrapper Checkout_Content_Wrapper">
                <div className="User_Tab_Card Checkout_Card">
                    <h1 className="User_Tab_Card_Title Checkout_Card_Title">Finalizar Compra</h1>
                    <div className="Checkout_List">
                        <div className="Checkout_Item">
                            <h2 className="Checkout_Item_Title">Product Title</h2>
                            <p className="Checkout_Item_Description">Product Description</p>
                            <p className="Checkout_Item_Price">R$ 100,00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client_Checkout;
