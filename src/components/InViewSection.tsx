import React, { useState, useEffect, useRef } from "react";

interface InViewSectionProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
}

export const InViewSection: React.FC<InViewSectionProps> = ({
  children,
  placeholder,
  rootMargin = "400px",
  minHeight = "400px",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef}>
      {isVisible ? (
        children
      ) : (
        placeholder || <div style={{ minHeight }} className="w-full flex items-center justify-center opacity-0" />
      )}
    </div>
  );
};
