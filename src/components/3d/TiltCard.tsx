import React, { useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`;

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`;
      glareRef.current.style.opacity = glare ? '1' : '0';
    }
  };

  const handlePointerLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative transform-gpu transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      }}
    >
      {children}

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
          ref={glareRef}
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
};
