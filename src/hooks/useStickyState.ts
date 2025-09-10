import { useState, useEffect, useRef } from 'react';

export function useStickyState() {
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const isCurrentlySticky = rect.top <= 0;
      
      if (isCurrentlySticky !== isSticky) {
        setIsSticky(isCurrentlySticky);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky]);

  return { isSticky, elementRef };
}
