import Image from "next/image";

const Client_About_Us = () => {
    return (
        <div className="About_Us">
            <div className="About_Us_Card">
                <h1 className={"About_Us_Title"}>A Chocolateria</h1>
                <div className="About_Us_Content">
                    <div className="About_Us_Description">
                        <p>
                            <strong>
                                A Tropical Cacau foi fundada por Letícia Guedes - Nutricionista que após anos de experiência - decidiu se aprofundar
                                na confeitaria e fundar uma chocolateria que tem como objetivo oferecer experiências únicas e saborosas para seus
                                clientes.
                            </strong>
                        </p>
                        <p>
                            A marca nasceu com a proposta de resgatar a tradição do chocolate artesanal e valorizar o cacau brasileiro. Desde os
                            ingredientes cuidadosamente selecionados, até a produção artesanal em nossa própria fábrica na região de Curitiba - Cada
                            etapa do processo é feita com paixão e responsabilidade.
                        </p>
                        <p>
                            Buscamos oferecer ao mundo o melhor do chocolate brasileiro por meio de uma cadeia produtiva justa e sustentável - Que
                            seja capaz de valorizar o trabalho das pessoas envolvidas e promover desenvolvimento econômico e social.
                        </p>

                        <div className="About_Us_Description_Image_Container">
                            <Image src="/promo_imgs/promo_01.jpg" alt="Leticia Guedes" width={400} height={600} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client_About_Us;
