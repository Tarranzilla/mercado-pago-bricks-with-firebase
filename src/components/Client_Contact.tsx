import MapComponent from "./GoogleMap";

const Client_Contact = () => {
    return (
        <div className="Contact">
            <div className="Contact_Card">
                <h1 className={"Contact_Title"}>Entre em Contato!</h1>
                <h2 className="Contact_Subtitle">Sinta-se a vontade para falar com a gente!</h2>
                <p className="Contact_Description">
                    Estamos de prontidão para responder suas dúvidas, atender pedidos e encomendar chocolates especiais e personalizados!
                </p>

                <div className="Contact_Content_Wrapper">
                    <div className="Contact_Content">
                        <div className="Contact_Content_Item">
                            <h3>Telefone</h3>
                            <p>+55 41 999 977 955</p>
                        </div>

                        <div className="Contact_Content_Item">
                            <h3>Email</h3>
                            <p>contato@tropicalcacau.com</p>
                        </div>

                        <div className="Contact_Content_Item">
                            <h3>Horários</h3>
                            <p>Segunda a Sexta: 09:00 - 12:00 | 13:00 - 18:00</p>
                        </div>

                        <div className="Contact_Content_Item">
                            <h3>Endereço</h3>
                            <p>Rua Francisco Camargo | nº 262</p>
                            <p>Apto 01 | Colombo | PR | Brasil</p>
                            <button className="Contact_Open_Map_Btn">Abrir o Mapa</button>
                        </div>
                    </div>

                    <div className="Contact_Map">
                        <MapComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client_Contact;
