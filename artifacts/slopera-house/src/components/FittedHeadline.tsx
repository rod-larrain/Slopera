import { useEffect, useRef } from 'react';

// Keep the existing typeface, two-line treatment and available space.
// Fit the longer new copy without changing the page's grid or breakpoints.
export function FittedHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      heading.style.fontSize = '';
      const size = Number.parseFloat(getComputedStyle(heading).fontSize);
      const secondLine = heading.querySelector('span');
      if (secondLine && secondLine.scrollWidth > heading.clientWidth) {
        heading.style.fontSize = `${size * heading.clientWidth / secondLine.scrollWidth}px`;
      }
    };
    void document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    fit();
    return () => { disposed = true; window.removeEventListener('resize', fit); };
  }, []);

  return (
    <h1 className="hero-title" ref={ref} data-testid="text-hero-title">
      Operatic <span style={{ whiteSpace: 'nowrap' }}>modern tragedies</span>
    </h1>
  );
}