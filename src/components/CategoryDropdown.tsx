import { Calendar, Moon, Target, Sparkles, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { i18n } from '../lib/i18n';
import type { CategorizedPaged, CategoryKey } from '../types';

interface CategoryDropdownProps {
  categorizedPaged: CategorizedPaged;
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

export function CategoryDropdown({ 
  categorizedPaged, 
  selectedCategory, 
  onCategoryChange 
}: CategoryDropdownProps) {
  const categories = [
    { key: 'all' as CategoryKey, label: i18n.all, icon: Calendar },
    { key: 'afterHours' as CategoryKey, label: i18n.afterHours, icon: Moon },
    { key: 'saturdays' as CategoryKey, label: i18n.saturdays, icon: Target },
    { key: 'sundaysHolidays' as CategoryKey, label: i18n.sundaysHolidays, icon: Sparkles },
  ];

  // Only show categories that have content
  const availableCategories = categories.filter(category => {
    const categoryData = categorizedPaged[category.key];
    return Object.keys(categoryData.slots).length > 0;
  });

  const selectedCategoryData = categories.find(cat => cat.key === selectedCategory);
  const selectedCategorySlots = categorizedPaged[selectedCategory];
  const slotsCount = selectedCategorySlots 
    ? Object.values(selectedCategorySlots.slots).reduce((sum, times) => sum + times.length, 0)
    : 0;

  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full touch-target bg-card/50 backdrop-blur-sm border-border/50 h-9">
        <div className="flex items-center gap-2 flex-1">
          {selectedCategoryData && (
            <>
              <selectedCategoryData.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium truncate">{selectedCategoryData.label}</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5 flex-shrink-0">
                  {slotsCount}
                </Badge>
              </div>
            </>
          )}
        </div>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </SelectTrigger>
      <SelectContent className="z-50 bg-background/95 backdrop-blur-md border border-border/50">
        {availableCategories.map(category => {
          const categoryData = categorizedPaged[category.key];
          const categorySlots = Object.values(categoryData.slots).reduce((sum, times) => sum + times.length, 0);
          
          return (
            <SelectItem
              key={category.key}
              value={category.key}
              className="focus:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <category.icon className="w-4 h-4" />
                <span className="flex-1">{category.label}</span>
                <Badge variant="outline" className="text-xs">
                  {categorySlots}
                </Badge>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}