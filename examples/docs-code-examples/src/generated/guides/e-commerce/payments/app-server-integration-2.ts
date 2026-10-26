const tokenResponse = {
  data: {
    token: "example-jwt",
  },
};

await fetch("https://shopware.mypaymentgateway.com/api/store/card", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResponse.data?.token}`, // jwt token from the sample code above
  },
  body: JSON.stringify({
    cardId: "card_123",
    tokenId: "some-secret-token_123",
  }),
});
