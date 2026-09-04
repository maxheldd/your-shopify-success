import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Safety net: never leave content permanently hidden.
    const fallback = window.setTimeout(() => setIsInView(true), 1200);

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
          window.clearTimeout(fallback);
        }
      },
      // threshold 0 so tall sections (taller than the phone screen) still trigger
      { threshold: 0, rootMargin: "0px 0px -5% 0px", ...options },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isInView };
}
