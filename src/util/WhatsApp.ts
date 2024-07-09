export const generate_whatsapp_url_for_more_order_info = (orderNumber: string, businessTelephone: string) => {
    let message = "Olá, eu gostaria de informações sobre o pedido nº:\n\n #" + orderNumber + "\n\n";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

export const generate_whatsapp_url_for_contacting_client = (clientName: string, clientTelephone: string) => {
    let message = "Olá" + { clientName } + ", aqui é a Letícia da Tropical Cacau!";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${clientTelephone}?text=${encodedMessage}`;
};
