import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEditedUser } from "@/store/slices/user_slice";
import { setUserTabOpen } from "@/store/slices/interface_slice";
import { User as User_Local } from "@/types/User";
import { Address } from "@/types/Address";

import Image from "next/image";

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

                <input
                    className="User_Info_Item_Input"
                    type="text"
                    placeholder={placeholder}
                    value={editedLocalUser.name}
                    onChange={(e) => handleLocalUserChange("name", e.target.value)}
                />
                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
            </div>
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

                <input
                    className="User_Info_Item_Input"
                    type="text"
                    placeholder={placeholder}
                    value={editedLocalUser.email}
                    onChange={(e) => handleLocalUserChange("email", e.target.value)}
                />

                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
            </div>
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

                <input
                    className="User_Info_Item_Input"
                    type="text"
                    placeholder={placeholder}
                    value={editedLocalUser.telephone}
                    onChange={(e) => handleLocalUserChange("telephone", e.target.value)}
                />

                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
            </div>
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
                <div className="User_Tab_Card" id="General_Information_Card">
                    <h1 className="User_Tab_Card_Title">Informações Gerais</h1>
                    {customer_has_not_updated_his_main_info && (
                        <div className="User_Tab_Card_Alert">
                            <span className="material-icons">info</span>
                            <p className="User_Tab_Card_Alert_Text">Preencha corretamente estas informações antes de efetuar um pedido.</p>
                        </div>
                    )}
                    <div className="User_Tab_Card_Info">
                        <div className="User_Tab_Card_Info_Image_Container">
                            {customer.avatar_url && customer.name && (
                                <Image className="User_Tab_Card_Info_Image" width={128} height={128} src={customer.avatar_url} alt={customer.name} />
                            )}
                            {!customer.avatar_url && <span className="material-icons User_Tab_Card_Info_No_Image">person_pin</span>}

                            <span className="User_Info_Item_Icon Avatar_Img material-icons">mode_edit</span>
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
