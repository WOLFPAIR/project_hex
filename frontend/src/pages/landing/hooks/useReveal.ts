import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element once it scrolls into view. Returns a ref to attach and a
 * boolean that flips to true on first intersection (and stays true).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.18 },
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
