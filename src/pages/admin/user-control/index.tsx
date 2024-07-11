import axios from "axios";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/types/User";

const GET_ALL_USERS_URL = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_USERS;

if (!GET_ALL_USERS_URL) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_USERS environment variable is not defined");
}

const UserControlUserCard = (user: User) => {
    const [showOrders, setShowOrders] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);

    return (
        <div className={showOrders ? "User_Control_User_Card Active" : "User_Control_User_Card"}>
            <div className="User_Control_User_Card_Upper_Content">
                {user.avatar_url === "" || user.avatar_url === "Nenhuma Imagem Definida" ? (
                    <span className="material-icons User_Control_No_Image">account_circle</span>
                ) : (
                    <img src={user.avatar_url}></img>
                )}

                <div className="User_Control_User_Card_Content">
                    <h3>{user.name}</h3>
                    <p>
                        <span className="material-icons">mail</span>
                        {user.email}
                    </p>
                    <p>
                        <span className="material-icons">smartphone</span>
                        {user.telephone}
                    </p>
                    <p>
                        {user.isAdmin && <span className="material-icons">admin_panel_settings</span>}
                        {!user.isAdmin && <span className="material-icons">admin_panel_settings</span>}
                        {user.isAdmin ? "Administrador" : "Comprador"}
                    </p>
                </div>
            </div>

            <div className="User_Control_User_Card_Content">
                <div className="User_Control_User_Card_Orders">
                    <div className="User_Control_User_Card_Orders_Header">
                        <h4>
                            {user.subscriptions.length} {user.subscriptions.length === 1 ? "Assinatura" : "Assinaturas"}
                        </h4>
                        <button onClick={() => setShowSubscriptions(!showSubscriptions)}>
                            <span className="material-icons">more_horiz</span> Ver Assinaturas
                        </button>
                    </div>

                    {showSubscriptions && (
                        <ul>
                            {user.subscriptions.map((subscription, index) => (
                                <li key={index}>{subscription}</li>
                            ))}
                        </ul>
                    )}

                    <div className="User_Control_User_Card_Orders_Header">
                        <h4>
                            {user.orders.length} {user.orders.length === 1 ? "Pedido" : "Pedidos"}
                        </h4>
                        <button onClick={() => setShowOrders(!showOrders)}>
                            <span className="material-icons">more_horiz</span> Ver Pedidos
                        </button>
                    </div>

                    {showOrders && (
                        <ul>
                            {user.orders.map((order, index) => (
                                <li key={index}>{order}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserControl = () => {
    const user = useSelector((state: RootState) => state.user.currentUser);
    const [users, setUsers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [userCategory, setUserCategory] = useState("all");
    const [minimumOrders, setMinimumOrders] = useState(0);

    const filteredUsers = users.filter((user) => {
        // Check if any user's attribute (name, email, or telephone) matches the search query, if provided
        const matchesSearch =
            userSearch === "" ||
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.telephone.toLowerCase().includes(userSearch.toLowerCase());

        // Extended matchesCategory to include "subscriber" category
        const matchesCategory =
            userCategory === "all" ||
            (userCategory === "admin" && user.isAdmin) ||
            (userCategory === "user" && !user.isAdmin) ||
            (userCategory === "subscriber" && user.isSubscriber); // Added condition for subscriber

        // Check if user meets the minimum orders requirement
        const meetsOrderRequirement = minimumOrders <= 0 || user.orders.length >= minimumOrders;

        // Return true if any search-related condition is met and the order requirement is met
        return matchesSearch && matchesCategory && meetsOrderRequirement;
    });

    useEffect(() => {
        if (user?.isAdmin) {
            axios
                .get(GET_ALL_USERS_URL, {
                    params: {
                        id: user.id, // This adds '?id=yourUserId' to the GET request URL
                    },
                })
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    return (
        <div className="User_Control_Card">
            <h2 className="Order_Control_Title">Controle de Usuários</h2>

            <div className="User_Control_Filter">
                <h2 className="Order_Control_Filter_Title">Filtro</h2>

                <div className="User_Control_Filter_Item User_Control_Filter_Item_Special_Input">
                    <input
                        type="text"
                        placeholder="Pesquisar Usuário, Telefone ou E-mail"
                        onChange={(e) => {
                            setUserSearch(e.target.value);
                        }}
                    />

                    <span className="material-icons">search</span>
                </div>

                <select
                    className="User_Control_Filter_Item"
                    onChange={(e) => {
                        setUserCategory(e.target.value);
                    }}
                >
                    <option value="all">Todos</option>
                    <option value="admin">Administradores</option>
                    <option value="user">Compradores</option>
                    <option value="subscriber">Assinantes</option>
                </select>

                <input
                    className="User_Control_Filter_Item"
                    type="number"
                    min="0" // Set minimum value to 0
                    placeholder="Quantidade Mínima de Pedidos"
                    onChange={(e) => {
                        setMinimumOrders(parseInt(e.target.value));
                    }}
                />
            </div>

            <div className="User_Control_Users_List">
                {users.length === 0 && <p>Nenhum usuário encontrado</p>}
                {users.length > 0 && filteredUsers.map((unique_user) => <UserControlUserCard key={unique_user.id} {...unique_user} />)}
            </div>
        </div>
    );
};

export default UserControl;
