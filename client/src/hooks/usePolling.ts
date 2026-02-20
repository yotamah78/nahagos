import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void, intervalMs: number, enabled = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    // Call immediately on mount
    callbackRef.current();

    const id = setInterval(() => {
      // Pause when tab is hidden to save resources
      if (document.visibilityState === 'visible') {
        callbackRef.current();
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
