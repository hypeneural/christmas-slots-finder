import React from 'react';
import { SlotButton } from './SlotButton';
import { Badge } from './ui/badge';
import { Sun, SunMedium, Moon, Sparkles, Star, Gift } from 'lucide-react';

interface TimePeriodSectionProps {
  period: 'morning' | 'afternoon' | 'evening';
  times: string[];
  onSlotClick: (time: string) => void;
}

const periodConfig = {
  morning: {
    label: 'Manhã',
    icon: Sun,
    timeRange: '06:00 - 12:00',
    className: 'from-red-50/95 to-green-50/95 border-red-300/80 bg-gradient-to-br from-red-50/70 to-green-50/70 shadow-lg shadow-red-100/30',
    iconClassName: 'text-red-700',
    badgeClassName: 'bg-gradient-to-r from-red-200/95 to-red-300/95 text-red-900 border-red-400/80 backdrop-blur-sm shadow-sm',
    textClassName: 'text-slate-900',
    subtitleClassName: 'text-slate-700',
    decoration: '❄️',
    sparkleColor: 'text-red-400'
  },
  afternoon: {
    label: 'Tarde',
    icon: SunMedium,
    timeRange: '13:00 - 18:00',
    className: 'from-green-50/95 to-emerald-50/95 border-green-300/80 bg-gradient-to-br from-green-50/70 to-emerald-50/70 shadow-lg shadow-green-100/30',
    iconClassName: 'text-green-700',
    badgeClassName: 'bg-gradient-to-r from-green-200/95 to-green-300/95 text-green-900 border-green-400/80 backdrop-blur-sm shadow-sm',
    textClassName: 'text-slate-900',
    subtitleClassName: 'text-slate-700',
    decoration: '🎄',
    sparkleColor: 'text-green-400'
  },
  evening: {
    label: 'Noite',
    icon: Moon,
    timeRange: '18:00 - 23:00',
    className: 'from-slate-50/95 to-red-50/95 border-slate-300/80 bg-gradient-to-br from-slate-50/70 to-red-50/70 shadow-lg shadow-slate-100/30',
    iconClassName: 'text-slate-800',
    badgeClassName: 'bg-gradient-to-r from-slate-200/95 to-slate-300/95 text-slate-900 border-slate-400/80 backdrop-blur-sm shadow-sm',
    textClassName: 'text-slate-900',
    subtitleClassName: 'text-slate-700',
    decoration: '⭐',
    sparkleColor: 'text-yellow-400'
  }
};

export function TimePeriodSection({ period, times, onSlotClick }: TimePeriodSectionProps) {
  if (times.length === 0) {
    return (
      <div className={`${periodConfig[period].className} rounded-xl border p-4 mb-4 opacity-60 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm ${periodConfig[period].iconClassName}`}>
            {React.createElement(periodConfig[period].icon, { className: "w-5 h-5" })}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${periodConfig[period].textClassName}`}>{periodConfig[period].label}</h3>
            <p className={`text-sm ${periodConfig[period].subtitleClassName}`}>Nenhum horário disponível</p>
          </div>
        </div>
      </div>
    );
  }

  const config = periodConfig[period];
  const Icon = config.icon;

  return (
    <div className={`${config.className} rounded-xl border p-4 mb-4 backdrop-blur-sm relative overflow-hidden group hover:shadow-xl hover:shadow-red-100/20 transition-all duration-300`}>
      {/* Decoração natalina animada */}
      <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
        <Sparkles className={`w-4 h-4 ${config.sparkleColor} animate-twinkle`} />
      </div>
      
      {/* Emoji decorativo */}
      <div className="absolute top-2 left-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-gentle-sway">
        {config.decoration}
      </div>
      
      {/* Estrelas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            className={`absolute w-2 h-2 ${config.sparkleColor} opacity-20 animate-twinkle`}
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 25}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-md ${config.iconClassName} relative group-hover:shadow-lg transition-all duration-300`}>
          <Icon className="w-5 h-5" />
          {/* Brilho natalino pulsante */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 ${config.sparkleColor.replace('text-', 'bg-')} rounded-full opacity-70 animate-pulse`}></div>
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${config.textClassName} group-hover:scale-105 transition-transform duration-300`}>
            {config.label}
          </h3>
          <p className={`text-sm ${config.subtitleClassName}`}>{config.timeRange}</p>
        </div>
        <Badge variant="outline" className={`${config.badgeClassName} group-hover:scale-105 transition-transform duration-300`}>
          <Gift className="w-3 h-3 mr-1" />
          {times.length} horário{times.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 relative z-10">
        {times.map((time) => (
          <SlotButton
            key={time}
            time={time}
            onClick={() => onSlotClick(time)}
          />
        ))}
      </div>
    </div>
  );
}
