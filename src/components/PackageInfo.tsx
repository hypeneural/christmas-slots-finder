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
    <Card className="mx-4 mb-6 bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {pkg.name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {i18n.duration(pkg.durationMinutes)}
              </span>
            </div>
          </div>
          
          {pkg.badges && pkg.badges.length > 0 && (
            <div className="flex flex-col gap-1">
              {pkg.badges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}