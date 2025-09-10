import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
}

export function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Create initial snowflakes with more variety
    const createSnowflakes = () => {
      const count = isMobile ? 30 : 60; // Fewer flakes on mobile for performance
      const initialSnowflakes: Snowflake[] = [];
      
      for (let i = 0; i < count; i++) {
        initialSnowflakes.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 6 + 1, // Varied sizes
          speed: Math.random() * 3 + 0.5, // Slower, more realistic
          opacity: Math.random() * 0.9 + 0.1,
          drift: Math.random() * 3 - 1.5, // More drift
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2, // Rotation speed
        });
      }
      return initialSnowflakes;
    };

    setSnowflakes(createSnowflakes());

    const animateSnow = () => {
      setSnowflakes(prev => 
        prev.map(flake => {
          let newY = flake.y + flake.speed;
          let newX = flake.x + flake.drift * 0.3; // Slower drift
          let newRotation = flake.rotation + flake.rotationSpeed;

          // Reset snowflake when it reaches bottom
          if (newY > window.innerHeight + 10) {
            newY = -10;
            newX = Math.random() * window.innerWidth;
            newRotation = Math.random() * 360;
          }

          // Wrap around horizontally
          if (newX > window.innerWidth + 10) newX = -10;
          if (newX < -10) newX = window.innerWidth + 10;

          return {
            ...flake,
            x: newX,
            y: newY,
            rotation: newRotation,
          };
        })
      );
    };

    const interval = setInterval(animateSnow, 60); // Slightly slower for smoother animation
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background gradient for winter atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-white/10" />
      
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/90 shadow-lg"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            transform: `rotate(${flake.rotation}deg)`,
            filter: 'blur(0.3px) drop-shadow(0 0 3px rgba(255,255,255,0.3))',
            animation: `snowfall ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Add some sparkles for magical effect */}
      <div className="absolute inset-0">
        {[...Array(isMobile ? 8 : 15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}