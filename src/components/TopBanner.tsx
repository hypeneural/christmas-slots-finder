import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { i18n } from '../lib/i18n';

interface TopBannerProps {
  packageSlug: string;
  onChangePackage: () => void;
}

export function TopBanner({ packageSlug, onChangePackage }: TopBannerProps) {
  if (packageSlug !== 'ho-ho-ho') {
    return null;
  }

  return (
    <div className="app-section">
      <div className="app-card bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/30">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-accent/20 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-base text-foreground leading-relaxed mb-4">
                {i18n.premiumHoursBanner}
              </p>
              <Button
                onClick={onChangePackage}
                className="touch-large bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground font-bold shadow-button hover:shadow-glow active:scale-95 transition-all duration-200"
              >
                {i18n.changePackage}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}