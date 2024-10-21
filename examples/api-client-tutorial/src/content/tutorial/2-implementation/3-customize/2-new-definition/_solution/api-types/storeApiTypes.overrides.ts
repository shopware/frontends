import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents & {
  schemas: Schemas;
};

export type Schemas = {
  // here go the entities definitions available, that can be used in operations but also imported and used standalone
  AiAnswer: {
    content: string;
  };
  AiPrompt: {
    role: "system" | "user" | "assistant";
    content: string;
  };
};

export type operations = {
  // here go the endpoints and its definitions that can refer to the Schemas but it's not a requirement
  "sendAskAi post /ai-assistant/prompt": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["AiPrompt"];
    response: components["schemas"]["AiAnswer"];
    responseCode: 200;
  };
};
