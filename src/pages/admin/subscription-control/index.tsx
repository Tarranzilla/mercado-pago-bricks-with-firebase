const SubscriptionControl = () => {
    return (
        <>
            <div className="Product_Control_Card Control_Card">
                <h2 className="Control_Title">Controle de Assinaturas</h2>

                <div className="Order_Control_Filter">
                    <h2 className="Order_Control_Filter_Title">Filtro de Assinaturas</h2>

                    <div className="Order_Control_Filter_Inputs">
                        <div className="Order_Control_Filter_Item Order_Control_General_Search_Filter">
                            <span className="material-icons">search</span>

                            <input
                                type="text"
                                placeholder="Buscar Assinatura (Nome do Cliente, Código de Identificação, Endereço de Entrega, etc.)"
                                onChange={(e) => {
                                    // setGeneralSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubscriptionControl;
