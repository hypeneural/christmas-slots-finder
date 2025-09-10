import logoImage from '../assets/logo.webp';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative overflow-hidden safe-area-top">
      <div 
        className="h-32 sm:h-28 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/70 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 rounded-3xl blur-xl opacity-50 animate-pulse-gentle scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-white/3 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative p-6 rounded-3xl glass-card shadow-lg transition-all hover:scale-105 active:scale-95 duration-300 border border-white/5">
              <img 
                src={logoImage} 
                alt="Fotos de Natal - Sessões especiais 2025" 
                className="w-24 h-24 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm sm:text-xs font-bold text-primary drop-shadow-lg tracking-wide">
              Sessões especiais 2025 🎄
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}