import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Link from "next/link";

const User_Tab_Admin_Information = () => {
    const customer = useSelector((state: RootState) => state.user.currentUser);

    return (
        <>
            {/* Card de Informações de Administrador */}
            {customer && customer.isAdmin === true && (
                <div className="User_Tab_Card">
                    <h1 className="User_Tab_Card_SubTitle">Administração</h1>

                    <div className="Admin_Actions_List">
                        <Link className="Control_Panel_Link_Btn" href="/admin/control-panel">
                            <p className="Control_Panel_Link_Btn_Text">Painel de Gestão</p>
                            <span className="material-icons">tune</span>
                        </Link>

                        <Link className="Control_Panel_Link_Btn" href="/admin/product-editor">
                            <p className="Control_Panel_Link_Btn_Text">Editor de Produtos</p>
                            <span className="material-icons">sell</span>
                        </Link>

                        <Link className="Control_Panel_Link_Btn" href="/admin/order-control">
                            <p className="Control_Panel_Link_Btn_Text">Controle de Pedidos</p>
                            <span className="material-icons">list_alt</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default User_Tab_Admin_Information;
