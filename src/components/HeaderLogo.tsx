import logoImage from '../assets/logo.webp';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative overflow-hidden safe-area-top">
      <div 
        className="h-48 sm:h-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/90 backdrop-blur-sm"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pt-4">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-xl opacity-60 pulse-christmas"></div>
            <div className="relative p-5 rounded-full glass-card shadow-glow transition-native hover:scale-105">
              <img 
                src={logoImage} 
                alt="Fotos de Natal" 
                className="w-20 h-20 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">
              Fotos de Natal
            </h1>
            <p className="text-base sm:text-sm text-accent font-semibold drop-shadow-sm shimmer-effect">
              Sessões especiais 2025 🎄
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}