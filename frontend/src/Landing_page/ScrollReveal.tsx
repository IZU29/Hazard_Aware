import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element enters the viewport, trigger the state
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible, we can stop observing it
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      },
      {
        root: null, // defaults to the browser viewport
        rootMargin: '0px',
        threshold: 0.15, // Triggers when 15% of the element is visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}