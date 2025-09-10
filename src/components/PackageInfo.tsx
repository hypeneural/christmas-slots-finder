import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Clock } from 'lucide-react';
import { i18n } from '../lib/i18n';
import type { Package } from '../types';

interface PackageInfoProps {
  package: Package;
}

export function PackageInfo({ package: pkg }: PackageInfoProps) {
  return (
    <div className="app-section">
      <div className="native-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-3">
                {pkg.name}
              </h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-glow/20 shadow-sm">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-base font-medium">
                  {i18n.duration(pkg.durationMinutes)}
                </span>
              </div>
            </div>
            
            {pkg.badges && pkg.badges.length > 0 && (
              <div className="flex flex-col gap-2">
                {pkg.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-sm border-accent/20 px-3 py-1 rounded-full"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}