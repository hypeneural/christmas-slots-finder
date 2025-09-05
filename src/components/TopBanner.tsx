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
    <div className="mx-4 mb-6 p-4 rounded-lg bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {i18n.premiumHoursBanner}
          </p>
          <Button
            onClick={onChangePackage}
            variant="outline"
            size="sm"
            className="mt-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            {i18n.changePackage}
          </Button>
        </div>
      </div>
    </div>
  );
}