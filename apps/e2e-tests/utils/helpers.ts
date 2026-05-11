import { findUp } from "find-up";
export const findEnv = () => findUp(process.env.ENV_FILE || ".env");
