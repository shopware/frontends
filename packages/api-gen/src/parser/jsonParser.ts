import json5 from "json5";
import prescribe from "./parserPrescriber";

export default (fileContent: string) => {
  return json5.parse(fileContent, prescribe);
};
