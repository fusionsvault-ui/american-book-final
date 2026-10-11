import React, { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ScrollToTop ensures that whenever the user navigates to any new page
 * or clicks any link (including in the footer or anywhere on the page),
 * the window viewport instantly and unconditionally resets to the top (0, 0).
 */
export const ScrollToTop: React.FC = () => {
  const [pathname] = useLocation();

  useEffect(() => {
    // Reset both window and root document scrolling
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Additional safeguard in case of delayed DOM paint
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
