const handlePaymentResponse = await handlePayment();
/* parameters omitted, see previous point */

const redirectUrl = handlePaymentResponse?.redirectUrl; // URL or undefined
