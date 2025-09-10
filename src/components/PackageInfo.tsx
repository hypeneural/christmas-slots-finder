import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Clock, Gift, Sparkles, ArrowLeft } from 'lucide-react';
import { i18n } from '../lib/i18n';
import type { Package } from '../types';

interface PackageInfoProps {
  package: Package;
  onChangePackage?: () => void;
}

export function PackageInfo({ package: pkg, onChangePackage }: PackageInfoProps) {
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
            
            {onChangePackage && (
              <Button
                onClick={onChangePackage}
                variant="outline"
                size="sm"
                className="text-xs bg-gradient-to-r from-red-100/80 to-green-100/80 text-slate-700 border-red-200/60 hover:from-red-200/80 hover:to-green-200/80 hover:border-red-300/60 transition-all duration-200 touch-target-enhanced performance-optimized"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Alterar pacote
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}