/**
 * Returns a promise that resolves after `ms` milliseconds simulating a sys
 * delay.
 * @param {number} ms
 */
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
