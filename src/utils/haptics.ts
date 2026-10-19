/**
 * Haptic tactile feedback utility using Web Vibration API.
 * Safely handles server-side rendering, unsupported browsers, and permission restrictions.
 */
export const triggerHaptic = (duration: number = 12): void => {
  if (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    typeof navigator.vibrate === 'function'
  ) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Silently catch permission or hardware errors
    }
  }
};
