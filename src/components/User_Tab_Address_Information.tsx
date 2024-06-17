import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEditedUser } from "@/store/slices/user_slice";
import { User as User_Local } from "@/types/User";
import { Address } from "@/types/Address";

const User_Tab_Address_Information = () => {
    const dispatch = useDispatch();

    const customer = useSelector((state: RootState) => state.user.currentUser);
    const editedCustomer = useSelector((state: RootState) => state.user.editedCurrentUser);

    const [addressEditControlOpen, setAddressEditControlOpen] = useState(false);

    const customer_has_not_updated_his_address =
        customer?.address?.street === "Nenhuma Rua Definida" ||
        customer?.address?.number === "Nenhum Número Definido" ||
        customer?.address?.city === "Nenhuma Cidade Definida" ||
        customer?.address?.state === "Nenhum Estado Definido" ||
        customer?.address?.zip === "Nenhum Código Postal Definido";

    const handleEditedLocalUserChange = (field: keyof User_Local, value: string | boolean | Address | string[]) => {
        if (editedCustomer) {
            dispatch(setCurrentEditedUser({ ...editedCustomer, [field]: value }));
        }
    };

    const handleEditedLocalUserAddressChange = (field: keyof Address, value: string) => {
        if (editedCustomer) {
            dispatch(
                setCurrentEditedUser({
                    ...editedCustomer,
                    address: { ...editedCustomer.address, [field]: value },
                })
            );
        }
    };

    return (
        <>
            {customer && editedCustomer && (
                <>
                    <div className="User_Tab_Card">
                        <h1 className="User_Tab_Card_SubTitle">Informações de Entrega</h1>

                        {customer_has_not_updated_his_address && (
                            <div className="User_Card_Address_Alert">
                                <span className="material-icons">info</span>
                                <p className="User_Card_Address_Alert_Text">
                                    Preencha corretamente estas informações antes de efetuar um pedido com entrega.
                                </p>
                            </div>
                        )}

                        <div className="User_Tab_Address_Resume">
                            <div className="Address_Resume_Content">
                                <h4>Endereço Completo</h4>
                                <p>
                                    {customer.address.street}, {customer.address.number}
                                    {customer.address.complement === "" || customer.address.complement === "Nenhum Complemento Definido"
                                        ? ""
                                        : `, ${customer.address.complement}`}
                                </p>
                                <p>
                                    {customer.address.city}, {customer.address.state}
                                </p>
                                <p>{customer.address.zip}</p>
                            </div>

                            <button
                                className="User_Info_Item_Edit_Btn"
                                onClick={() => {
                                    setAddressEditControlOpen(!addressEditControlOpen);
                                }}
                            >
                                {addressEditControlOpen ? (
                                    <>
                                        <span className="material-icons User_Tab_Edit_Icon">hide_source</span>
                                        <p className="User_Info_Item_Edit_Btn_Text"> Ocultar Edição</p>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons User_Tab_Edit_Icon">edit</span>
                                        <p className="User_Info_Item_Edit_Btn_Text">Editar</p>
                                    </>
                                )}
                            </button>
                        </div>

                        {addressEditControlOpen && (
                            <div className="User_Tab_Address_Edit_Control">
                                <div className="Address_Edit_Control_Item" id="address-street-control-item">
                                    <h4>Rua</h4>
                                    <input
                                        placeholder={customer.address.street}
                                        onChange={(e) => handleEditedLocalUserAddressChange("street", e.target.value)}
                                    />
                                </div>
                                <div className="Address_Edit_Control_Item" id="address-number-control-item">
                                    <h4>Número</h4>
                                    <input
                                        placeholder={customer.address.number}
                                        onChange={(e) => handleEditedLocalUserAddressChange("number", e.target.value)}
                                    />
                                </div>
                                <div className="Address_Edit_Control_Item" id="address-complement-control-item">
                                    <h4>Complemento</h4>
                                    <input
                                        placeholder={customer.address.complement}
                                        onChange={(e) => handleEditedLocalUserAddressChange("complement", e.target.value)}
                                    />
                                </div>
                                <div className="Address_Edit_Control_Item" id="address-city-control-item">
                                    <h4>Cidade</h4>
                                    <input
                                        placeholder={customer.address.city}
                                        onChange={(e) => handleEditedLocalUserAddressChange("city", e.target.value)}
                                    />
                                </div>
                                <div className="Address_Edit_Control_Item" id="address-state-control-item">
                                    <h4>Estado</h4>
                                    <input
                                        placeholder={customer.address.state}
                                        onChange={(e) => handleEditedLocalUserAddressChange("state", e.target.value)}
                                    />
                                </div>
                                <div className="Address_Edit_Control_Item" id="address-zip-control-item">
                                    <h4>Código Postal</h4>
                                    <input
                                        placeholder={customer.address.zip}
                                        onChange={(e) => handleEditedLocalUserAddressChange("zip", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default User_Tab_Address_Information;
