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
      <SelectTrigger className="w-full touch-target bg-white border-2 border-gray-200 h-12 text-base font-medium shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100">
        <div className="flex items-center gap-3 flex-1">
          {selectedCategoryData && (
            <>
              <selectedCategoryData.icon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-semibold truncate text-gray-900">{selectedCategoryData.label}</span>
                <Badge variant="secondary" className="bg-red-50 text-red-700 text-sm px-3 py-1 flex-shrink-0 font-semibold border border-red-200">
                  {slotsCount}
                </Badge>
              </div>
            </>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </SelectTrigger>
      <SelectContent className="z-50 bg-white border-2 border-gray-200 shadow-xl rounded-lg mx-2 mt-2 max-h-[300px] overflow-y-auto">
        {availableCategories.map(category => {
          const categoryData = categorizedPaged[category.key];
          const categorySlots = Object.values(categoryData.slots).reduce((sum, times) => sum + times.length, 0);
          
          return (
            <SelectItem
              key={category.key}
              value={category.key}
              className="focus:bg-red-50 focus:text-gray-900 cursor-pointer py-4 px-4 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 data-[highlighted]:bg-red-50 data-[highlighted]:text-gray-900"
            >
              <div className="flex items-center gap-4 w-full">
                <category.icon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="flex-1 font-semibold text-base text-gray-900">{category.label}</span>
                <Badge variant="outline" className="text-sm px-3 py-1 font-semibold bg-red-50 text-red-700 border border-red-200">
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