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
      <div className="min-h-screen bg-background">
        <HeaderLogo />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">{i18n.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderLogo />
      
      <div className="px-4 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {i18n.selectPackage}
          </h2>
          <p className="text-muted-foreground">
            Escolha seu pacote para ver os horários disponíveis
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.slug}
              className={`cursor-pointer transition-all duration-300 ${
                selectedPackage === pkg.slug
                  ? 'ring-2 ring-primary shadow-christmas bg-card'
                  : 'hover:shadow-lg bg-card/50 backdrop-blur'
              }`}
              onClick={() => setSelectedPackage(pkg.slug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {pkg.name}
                  </CardTitle>
                  {pkg.badges && pkg.badges.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs"
                    >
                      {pkg.badges[0]}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {i18n.duration(pkg.durationMinutes)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPackage && (
          <div className="max-w-md mx-auto mt-8">
            <Button
              onClick={handleViewSlots}
              className="w-full touch-target bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium shadow-christmas hover:shadow-glow"
              size="lg"
            >
              {i18n.viewAvailableSlots}
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border p-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            onClick={handleViewPackages}
            variant="outline"
            className="flex-1 touch-target border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver os pacotes
          </Button>
          
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="flex-1 touch-target border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Dúvidas? WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}