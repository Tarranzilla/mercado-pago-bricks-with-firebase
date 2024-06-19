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

    const customer_has_not_updated_his_address =
        customer?.address?.street === "Nenhuma Rua Definida" ||
        customer?.address?.street === "" ||
        customer?.address?.number === "Nenhum Número Definido" ||
        customer?.address?.number === "" ||
        customer?.address?.city === "Nenhuma Cidade Definida" ||
        customer?.address?.city === "" ||
        customer?.address?.state === "Nenhum Estado Definido" ||
        customer?.address?.state === "" ||
        customer?.address?.zip === "Nenhum Código Postal Definido" ||
        customer?.address?.zip === "";

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
                        <h1 className="User_Tab_Card_Title">Informações de Entrega</h1>

                        {customer_has_not_updated_his_address && (
                            <div className="User_Tab_Card_Alert">
                                <span className="material-icons">info</span>
                                <p className="User_Tab_Card_Alert_Text">
                                    Preencha corretamente estas informações antes de efetuar um pedido com entrega.
                                </p>
                            </div>
                        )}

                        <div className="User_Tab_Address_Edit_Control">
                            <div className="Address_Edit_Control_Item" id="address-street-control-item">
                                <h4>Rua</h4>
                                <input
                                    placeholder="Nova Rua"
                                    value={editedCustomer.address.street}
                                    onChange={(e) => handleEditedLocalUserAddressChange("street", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                            <div className="Address_Edit_Control_Item" id="address-number-control-item">
                                <h4>Número</h4>
                                <input
                                    placeholder="Novo Número"
                                    value={editedCustomer.address.number}
                                    onChange={(e) => handleEditedLocalUserAddressChange("number", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                            <div className="Address_Edit_Control_Item" id="address-complement-control-item">
                                <h4>Complemento ( Opcional )</h4>
                                <input
                                    placeholder="Novo Complemento (Opcional)"
                                    value={editedCustomer.address.complement}
                                    onChange={(e) => handleEditedLocalUserAddressChange("complement", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                            <div className="Address_Edit_Control_Item" id="address-city-control-item">
                                <h4>Cidade</h4>
                                <input
                                    placeholder="Nova Cidade"
                                    value={editedCustomer.address.city}
                                    onChange={(e) => handleEditedLocalUserAddressChange("city", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                            <div className="Address_Edit_Control_Item" id="address-state-control-item">
                                <h4>Estado</h4>
                                <input
                                    placeholder="Novo Estado"
                                    value={editedCustomer.address.state}
                                    onChange={(e) => handleEditedLocalUserAddressChange("state", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                            <div className="Address_Edit_Control_Item" id="address-zip-control-item">
                                <h4>Código Postal</h4>
                                <input
                                    placeholder="Novo Código Postal"
                                    value={editedCustomer.address.zip}
                                    onChange={(e) => handleEditedLocalUserAddressChange("zip", e.target.value)}
                                />
                                <span className="User_Info_Item_Icon material-icons">mode_edit</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default User_Tab_Address_Information;
