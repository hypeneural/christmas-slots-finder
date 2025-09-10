import logoImage from '../assets/logo.webp';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative overflow-hidden safe-area-top">
      <div 
        className="h-36 sm:h-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/80 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-2xl opacity-60 animate-pulse-gentle"></div>
            <div className="relative p-5 rounded-2xl glass-card shadow-xl transition-all hover:scale-105 active:scale-95 duration-300">
              <img 
                src={logoImage} 
                alt="Fotos de Natal - Sessões especiais 2025" 
                className="w-16 h-16 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-lg sm:text-base font-bold text-foreground drop-shadow-xl tracking-wide">
              Sessões especiais 2025 🎄
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}