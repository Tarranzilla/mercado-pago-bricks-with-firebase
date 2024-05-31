import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { ICardPaymentBrickPayer, ICardPaymentBrickVisual, ICardPaymentFormData } from "@mercadopago/sdk-react/bricks/cardPayment/type";
import { IBrickStyle, IBrickCustomVariables, IBrickError, IPayerIdentification, IBrickVisual } from "@mercadopago/sdk-react/bricks/util/types/common";
import { IPaymentFormData, IAdditionalCardFormData, IPaymentBrickCustomization, TPaymentType } from "@mercadopago/sdk-react/bricks/payment/type";

// Inicializa o SDK do Mercado Pago
const mercadoPagoKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

if (mercadoPagoKey) {
    initMercadoPago(mercadoPagoKey);
}

const PaymentMercadoPago = () => {
    const initialization: TPaymentType["initialization"] = {
        amount: 1000,
        preferenceId: "test_preference_id",
    };

    const customization: IPaymentBrickCustomization = {
        paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
        },
    };

    const onSubmit: TPaymentType["onSubmit"] = async (formData: IPaymentFormData, additionalData?: IAdditionalCardFormData | null) => {
        return new Promise<void>((resolve, reject) => {
            fetch("/api/process_payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((response) => {
                    resolve(); // Resolver sem tratamento da resposta
                })
                .catch((error) => {
                    reject(error); // Rejeitar com o erro recebido
                });
        });
    };

    const onError = async (error: IBrickError) => {
        console.log(error);
    };
    const onReady = async () => {
        // callback executed when Brick is loaded
    };

    return <Payment initialization={initialization} customization={customization} onSubmit={onSubmit} onReady={onReady} onError={onError} />;
};
export default PaymentMercadoPago;
