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
                    <h1 className="User_Tab_Card_Title">Administração</h1>

                    <div className="Admin_Actions_List">
                        <Link className="Control_Panel_Link_Btn" href="/admin/user-control">
                            <p className="Control_Panel_Link_Btn_Text">Controle de Usuários</p>
                            <span className="material-icons">account_circle</span>
                        </Link>

                        <Link className="Control_Panel_Link_Btn" href="/admin/product-control">
                            <p className="Control_Panel_Link_Btn_Text">Controle de Produtos</p>
                            <span className="material-icons">category</span>
                        </Link>

                        <Link className="Control_Panel_Link_Btn" href="/admin/order-control">
                            <p className="Control_Panel_Link_Btn_Text">Controle de Pedidos</p>
                            <span className="material-icons">list_alt</span>
                        </Link>

                        <Link className="Control_Panel_Link_Btn" href="/admin/subscription-control">
                            <p className="Control_Panel_Link_Btn_Text">Controle de Assinaturas</p>
                            <span className="material-icons">loyalty</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default User_Tab_Admin_Information;
