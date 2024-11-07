import find from "find-up";
export const findEnv = () => find.sync(process.env.ENV_FILE || ".env");
