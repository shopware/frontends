import { useData } from "vitepress";
import { QueryResponse, Answer } from "../types";

type UseAiReturn = {
  sendQueryRequest: (query: string) => Promise<QueryResponse>;
  sendFeedback: (
    query: string,
    isCorrectAnswer: boolean,
    isCorrectDocument: boolean,
    document: Answer,
  ) => Promise<string>;
  buildHighlight: (answers: Answer) => string;
  prepareData: (answers: Answer[]) => Answer[];
  buildDocLink: (source: string) => string;
};

export function useAi(): UseAiReturn {
  const { site } = useData();

  /**
   * Send request to get request
   *
   * @param {string} query - Input value
   * @returns {Promise<QueryResponse>}
   */
  const sendQueryRequest = async (query: string): Promise<QueryResponse> => {
    const response = await fetch(
      `${site.value.themeConfig.ai.endpoint}/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
        }),
      },
    ).then((response) => response.json());
    return response;
  };

  /**
   * Send feedback request, rate answer
   *
   * @param {string} query
   * @param {boolean} isCorrectAnswer
   * @param {boolean} isCorrectDocument
   * @param {Answer} document
   * @returns
   */
  const sendFeedback = async (
    query: string,
    isCorrectAnswer: boolean,
    isCorrectDocument: boolean,
    document: Answer,
  ): Promise<string> => {
    const response = await fetch(
      `${site.value.themeConfig.ai.endpoint}/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          document: {
            id: document.document_id,
            content: document.context,
          },
          is_correct_answer: isCorrectAnswer,
          is_correct_document: isCorrectDocument,
          origin: "user-feedback",
        }),
      },
    ).then((response) => response.json());

    return response;
  };

  /**
   * Add <mark> tag on the highlighted positions
   *
   * @param answer
   * @returns
   */
  const buildHighlight = (answer) => {
    let text = answer.context;
    let offset = 0;

    answer.offsets_in_context.forEach((element) => {
      text =
        text.slice(0, element.start + offset) +
        "<mark>" +
        text.slice(element.start + offset);
      offset += 6;
      text =
        text.slice(0, element.end + offset) +
        "</mark>" +
        text.slice(element.end + offset);
      offset += 7;
    });

    return text;
  };

  /**
   * Remove empty documents
   *
   * @param {Answer[]} answers
   * @returns {Answer[]}
   */
  const prepareData = (answers: Answer[]): Answer[] =>
    answers.filter((element) => element.context);

  /**
   * Build doc link
   *
   * @param {string} source
   * @returns {string}
   */
  const buildDocLink = (source: string): string =>
    // @ts-ignore
    `${source.replaceAll("_", "/").replaceAll(".pdf", "")}`;

  return {
    sendQueryRequest,
    sendFeedback,
    buildHighlight,
    prepareData,
    buildDocLink,
  };
}
