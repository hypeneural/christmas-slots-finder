import logoImage from '../assets/logo.webp';
import heroImage from '../assets/christmas-hero.jpg';

export function HeaderLogo() {
  return (
    <header className="relative overflow-hidden">
      <div 
        className="h-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/95 backdrop-blur-sm"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative p-4 rounded-full bg-card/90 backdrop-blur border border-border/50 shadow-glow">
              <img 
                src={logoImage} 
                alt="Fotos de Natal" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Fotos de Natal
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Sessões especiais 2025 ✨
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}