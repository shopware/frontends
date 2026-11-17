export function getNextMenuItemIndex(
  key: string,
  currentIndex: number,
  count: number,
): number | undefined {
  if (count === 0) return undefined;
  switch (key) {
    case "ArrowDown":
      return (currentIndex + 1) % count;
    case "ArrowUp":
      return currentIndex <= 0 ? count - 1 : currentIndex - 1;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return undefined;
  }
}
