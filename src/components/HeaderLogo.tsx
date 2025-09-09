import logoImage from '../assets/logo.webp';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative overflow-hidden safe-area-top">
      <div 
        className="h-32 sm:h-28 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background/85 backdrop-blur-sm"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-xl opacity-70 pulse-christmas"></div>
            <div className="relative p-4 rounded-full glass-card shadow-glow transition-native hover:scale-105 active:scale-95">
              <img 
                src={logoImage} 
                alt="Fotos de Natal - Sessões especiais 2025" 
                className="w-16 h-16 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          </div>
          
          <div className="mt-1">
            <p className="text-lg sm:text-base font-bold text-foreground drop-shadow-lg shimmer-effect tracking-wide">
              Sessões especiais 2025 🎄
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}