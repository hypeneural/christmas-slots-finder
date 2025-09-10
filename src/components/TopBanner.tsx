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
      <div className="native-card bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex-shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-base text-foreground leading-relaxed mb-5">
                {i18n.premiumHoursBanner}
              </p>
              <Button
                variant="native"
                size="lg"
                onClick={onChangePackage}
                className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground font-bold shadow-lg hover:shadow-xl"
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