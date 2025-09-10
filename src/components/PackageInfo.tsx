import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Clock, Gift, Sparkles } from 'lucide-react';
import { i18n } from '../lib/i18n';
import type { Package } from '../types';

interface PackageInfoProps {
  package: Package;
}

export function PackageInfo({ package: pkg }: PackageInfoProps) {
  return (
    <div className="mb-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50/80 to-green-50/80 border border-red-200/60 shadow-lg backdrop-blur-sm">
        {/* Decoração natalina sutil */}
        <div className="absolute top-2 right-2 opacity-30">
          <Sparkles className="w-3 h-3 text-red-400 animate-twinkle" />
        </div>
        
        <div className="relative p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm">
                <Gift className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-0.5">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {i18n.duration(pkg.durationMinutes)}
                </p>
              </div>
            </div>
            
            {pkg.badges && pkg.badges.length > 0 && (
              <div className="flex gap-1">
                {pkg.badges.slice(0, 2).map((badge, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="text-xs bg-gradient-to-r from-red-100/80 to-green-100/80 text-slate-700 border-red-200/60 px-2 py-1 rounded-full font-medium"
                  >
                    {badge}
                  </Badge>
                ))}
                {pkg.badges.length > 2 && (
                  <Badge 
                    variant="outline"
                    className="text-xs bg-slate-100/80 text-slate-600 border-slate-200/60 px-2 py-1 rounded-full font-medium"
                  >
                    +{pkg.badges.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}