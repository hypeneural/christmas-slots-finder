import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { i18n } from '../lib/i18n';

interface TopBannerProps {
  packageSlug: string;
  onChangePackage: () => void;
}

export function TopBanner({ packageSlug, onChangePackage }: TopBannerProps) {
  // Show banner only for Ho-Ho-Ho package
  if (packageSlug !== 'ho-ho-ho') {
    return null;
  }

  return (
    <div className="app-section">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/8 to-accent/8 border border-secondary/20 shadow-lg">
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/20 flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Outros pacotes com horários especiais disponíveis
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onChangePackage}
              className="text-xs font-medium hover:bg-accent/10 transition-colors duration-200"
            >
              Ver outros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}