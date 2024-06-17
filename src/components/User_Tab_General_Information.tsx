import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEditedUser } from "@/store/slices/user_slice";
import { User as User_Local } from "@/types/User";
import { Address } from "@/types/Address";

export type User_String_Info_Container_Props = {
    label: string;
    placeholder: string;
    propertie: string;
    localUser: User_Local;
    editedLocalUser: User_Local;
    handleLocalUserChange: any;
};

export const User_Name_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
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
                        value={editedLocalUser.name}
                        onChange={(e) => handleLocalUserChange("name", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedLocalUser.name !== localUser.name ? `${editedLocalUser.name}*` : localUser.name}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </button>
            ) : (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </button>
            )}
        </div>
    );
};

export const User_Email_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
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
                        value={editedLocalUser.email}
                        onChange={(e) => handleLocalUserChange("email", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedLocalUser.email !== localUser.email ? `${editedLocalUser.email}*` : localUser.email}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </button>
            ) : (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </button>
            )}
        </div>
    );
};

export const User_Telephone_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
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
                        value={editedLocalUser.telephone}
                        onChange={(e) => handleLocalUserChange("telephone", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedLocalUser.telephone !== localUser.telephone ? `${editedLocalUser.telephone}*` : localUser.telephone}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </button>
            ) : (
                <button
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </button>
            )}
        </div>
    );
};

const User_Tab_General_Information = () => {
    const dispatch = useDispatch();

    const customer = useSelector((state: RootState) => state.user.currentUser);
    const editedCustomer = useSelector((state: RootState) => state.user.editedCurrentUser);

    // Funções para a atualização de dados do usuário
    const handleEditedLocalUserChange = (field: keyof User_Local, value: string | boolean | Address | string[]) => {
        if (editedCustomer) {
            dispatch(setCurrentEditedUser({ ...editedCustomer, [field]: value }));
        }
    };

    const customer_has_not_updated_his_main_info =
        customer?.name === "Nenhum Nome Definido" ||
        customer?.name === "" ||
        customer?.email === "Nenhum Email Definido" ||
        customer?.email === "" ||
        customer?.telephone === "Nenhum Número de Telefone Definido" ||
        customer?.telephone === "";

    return (
        <>
            {customer && editedCustomer && (
                <div className="User_Tab_Card">
                    <h1 className="User_Tab_Card_SubTitle">Informações Gerais</h1>
                    {customer_has_not_updated_his_main_info && (
                        <div className="User_Card_Address_Alert">
                            <span className="material-icons">info</span>
                            <p className="User_Card_Address_Alert_Text">Preencha corretamente estas informações antes de efetuar um pedido.</p>
                        </div>
                    )}
                    <div className="User_Tab_Card_Info">
                        <div className="User_Tab_Card_Info_Image_Container">
                            {customer.avatar_url && customer.name && (
                                <img className="User_Tab_Card_Info_Image" src={customer.avatar_url} alt={customer.name} />
                            )}
                            {!customer.avatar_url && <span className="material-icons User_Tab_Card_Info_No_Image">person_pin</span>}

                            <div className="User_Tab_Card_Info_Image_Edit_Btn">
                                <span className="material-icons User_Info_Item_Edit_Btn_Icon" onClick={() => {}}>
                                    edit
                                </span>
                                <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                            </div>
                        </div>

                        <div className="User_Tab_Card_Info_Items_List">
                            <User_Name_Info_Container
                                key="Nome"
                                label="Nome"
                                placeholder="Novo Nome"
                                propertie="name"
                                localUser={customer}
                                editedLocalUser={editedCustomer}
                                handleLocalUserChange={handleEditedLocalUserChange}
                            />

                            <User_Email_Info_Container
                                key="Email"
                                label="Email"
                                placeholder="Novo Email"
                                propertie="email"
                                localUser={customer}
                                editedLocalUser={editedCustomer}
                                handleLocalUserChange={handleEditedLocalUserChange}
                            />

                            <User_Telephone_Info_Container
                                key="Telefone"
                                label="Telefone"
                                placeholder="Novo Telefone"
                                propertie="telephone"
                                localUser={customer}
                                editedLocalUser={editedCustomer}
                                handleLocalUserChange={handleEditedLocalUserChange}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default User_Tab_General_Information;
