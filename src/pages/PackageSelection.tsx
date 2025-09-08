import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { HeaderLogo } from '../components/HeaderLogo';
import { Clock, ExternalLink, MessageCircle } from 'lucide-react';
import { fetchPackages } from '../services/api';
import { i18n } from '../lib/i18n';
import type { Package } from '../types';

export default function PackageSelection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await fetchPackages();
        setPackages(data);
        
        // Try to load last selected package from localStorage
        const lastSelected = localStorage.getItem('lastSelectedPackage');
        if (lastSelected && data.some(pkg => pkg.slug === lastSelected)) {
          setSelectedPackage(lastSelected);
        }
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const handleViewSlots = () => {
    if (selectedPackage) {
      // Save selection to localStorage
      localStorage.setItem('lastSelectedPackage', selectedPackage);
      navigate(`/${selectedPackage}`);
    }
  };

  const handleViewPackages = () => {
    const packagesUrl = import.meta.env.VITE_SITE_PACKAGES_URL || 'https://fotosdenatal.com';
    window.open(packagesUrl, '_blank');
  };

  const handleWhatsApp = () => {
    const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || 'https://w.fotosdenatal.com/';
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="app-container">
        <HeaderLogo />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">{i18n.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <HeaderLogo />
      
      <div className="app-section">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {i18n.selectPackage}
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha seu pacote para ver os horários disponíveis
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto pb-40">
          {packages.map((pkg) => (
            <Card
              key={pkg.slug}
              className={`cursor-pointer transition-all duration-300 active:scale-98 ${
                selectedPackage === pkg.slug
                  ? 'ring-2 ring-primary shadow-christmas app-card bg-primary/5 border-primary/30 scale-[1.02]'
                  : 'hover:shadow-lg app-card hover:bg-primary/2 border-border hover:border-primary/20'
              }`}
              onClick={() => setSelectedPackage(pkg.slug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground font-bold">
                    {pkg.name}
                  </CardTitle>
                  {pkg.badges && pkg.badges.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold shadow-button"
                    >
                      {pkg.badges[0]}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-base font-medium">
                    {i18n.duration(pkg.durationMinutes)}
                  </span>
                </div>
                
                {selectedPackage === pkg.slug && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-subtle"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* Fixed Footer with Safe Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
        <div className="p-4 max-w-md mx-auto space-y-3">
          {/* Main CTA Button - Only show when package is selected */}
          <div className={`transition-all duration-700 ease-out ${selectedPackage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'}`}>
            {selectedPackage && (
              <Button
                onClick={handleViewSlots}
                className="w-full h-14 bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group animate-pulse-gentle"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-xl">🎄</span>
                  <span>{i18n.viewAvailableSlots}</span>
                  <span className="text-xl">🎄</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            )}
          </div>
          
          {/* Secondary buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleViewPackages}
              variant="outline"
              className="flex-1 h-12 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 font-semibold transition-all duration-200 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              <span className="text-sm">Ver pacotes</span>
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="flex-1 h-12 border-2 border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary/50 font-semibold transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Dúvidas?</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}