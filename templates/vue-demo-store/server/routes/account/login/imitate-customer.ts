import apiClient from "../../../apiBuilder";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.customerId || !body.token || !body.userId) {
    await sendRedirect(event, "/", 400);
    return;
  }

  const response = await apiClient.invoke(
    "imitateCustomerLogin post /account/login/imitate-customer",
    {
      body: {
        customerId: body.customerId,
        token: body.token,
        userId: body.userId,
      },
    },
  );
  if (!response.headers["sw-context-token"]) {
    await sendRedirect(event, "/", 400);
    return;
  }
  setCookie(event, "sw-context-token", response.headers["sw-context-token"]);

  await sendRedirect(event, "/account", 200);
});
