import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

export function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create initial snowflakes
    const initialSnowflakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      initialSnowflakes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        drift: Math.random() * 2 - 1,
      });
    }
    setSnowflakes(initialSnowflakes);

    const animateSnow = () => {
      setSnowflakes(prev => 
        prev.map(flake => {
          let newY = flake.y + flake.speed;
          let newX = flake.x + flake.drift * 0.5;

          // Reset snowflake when it reaches bottom
          if (newY > window.innerHeight) {
            newY = -10;
            newX = Math.random() * window.innerWidth;
          }

          // Wrap around horizontally
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;

          return {
            ...flake,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animateSnow, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/80 shadow-sm animate-pulse"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            filter: 'blur(0.5px)',
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}