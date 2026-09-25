import { cardFieldElements, cardFields } from "./snippet-context";

async function onFormSubmit() {
  const cardState = await cardFields.getState();

  if (cardState.isFormValid) {
    // This will trigger the `onApprove` event
    cardFields.submit();

    return;
  }

  // Do some advanced error handling, e.g. focus the invalid field
  const firstInvalidFieldKey = (
    Object.keys(cardState.fields) as Array<keyof typeof cardState.fields>
  ).find((key) => !cardState.fields[key].isValid);
  if (firstInvalidFieldKey) {
    cardFieldElements[firstInvalidFieldKey]?.focus();
  }
}
