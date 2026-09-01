export async function getRandomNumber() {
  return Math.floor(Math.random() * 10000 + 1);
}

/** Must not collide with customers an earlier run created on the shared backend. */
export function uniqueEmail() {
  const unique = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `e2e-${unique}@example.com`;
}
