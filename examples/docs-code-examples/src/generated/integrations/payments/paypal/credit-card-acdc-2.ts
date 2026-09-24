async function onFormSubmit() {
  const cardState = await cardFields.getState();

  if (state.isFormValid) {
    // This will trigger the `onApprove` event
    cardFields.submit();

    return;
  }

  // Do some advanced error handling, e.g. focus the invalid field
  const firstInvalidFieldKey = Object.keys(state.fields).find(
    (key) => !state.fields[key].isValid,
  );
  this.fields[firstInvalidFieldKey]?.focus();
}
