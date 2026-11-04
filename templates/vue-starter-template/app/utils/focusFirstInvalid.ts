/**
 * Moves focus to the first field marked invalid, once the error has rendered.
 * Error text is not a live region, so this is how a screen reader hears it.
 */
export function focusFirstInvalid() {
  nextTick(() => {
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}
