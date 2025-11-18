import * as React from "react";

// Align with Tailwind's 'sm' breakpoint (768px). For mobile, treat width <= 768px as mobile.
const SM_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SM_BREAKPOINT}px)`);
    const onChange = () => {
      // Consider exact 768px as mobile as per requirement (≤ sm)
      setIsMobile(window.innerWidth <= SM_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    // Initial state
    setIsMobile(window.innerWidth <= SM_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
