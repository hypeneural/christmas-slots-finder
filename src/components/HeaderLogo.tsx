import { Camera } from 'lucide-react';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative">
      <div 
        className="h-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary glow-effect">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">
              Fotos de Natal
            </h1>
            <p className="text-sm text-muted-foreground">
              Sessões especiais 2025
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}