import { cardFieldElements, cardFields } from "./snippet-context";

async function onFormSubmit() {
  const cardState = await cardFields.getState();

  if (cardState.isFormValid) {
    // This will trigger the `onApprove` event
    cardFields.submit();

    return;
  }

  // Do some advanced error handling, e.g. focus the invalid field
  const firstInvalidFieldKey = Object.keys(cardState.fields).find(
    (key): key is keyof typeof cardState.fields =>
      !cardState.fields[key as keyof typeof cardState.fields].isValid,
  );
  if (firstInvalidFieldKey) {
    cardFieldElements[firstInvalidFieldKey]?.focus();
  }
}
