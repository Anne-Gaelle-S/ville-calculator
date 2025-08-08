/**
 * Utilitaire pour créer une fonction debounced
 * @param func - Fonction à debouncer
 * @param delay - Délai en millisecondes
 * @returns Fonction debouncée
 */
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: number

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
