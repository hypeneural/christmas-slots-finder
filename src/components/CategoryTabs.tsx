import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DateAccordion } from './DateAccordion';
import { Pagination } from './Pagination';
import { i18n } from '../lib/i18n';
import type { CategorizedPaged, CategoryKey } from '../types';

interface CategoryTabsProps {
  categorizedPaged: CategorizedPaged;
  onSlotClick: (date: string, time: string) => void;
  onPageChange: (category: CategoryKey, page: number) => void;
}

export function CategoryTabs({ categorizedPaged, onSlotClick, onPageChange }: CategoryTabsProps) {
  const categories = [
    { key: 'all' as CategoryKey, label: i18n.all, icon: '📅' },
    { key: 'afterHours' as CategoryKey, label: i18n.afterHours, icon: '🌙' },
    { key: 'saturdays' as CategoryKey, label: i18n.saturdays, icon: '🎯' },
    { key: 'sundaysHolidays' as CategoryKey, label: i18n.sundaysHolidays, icon: '✨' },
  ];

  // Only show tabs that have content
  const availableCategories = categories.filter(category => {
    const categoryData = categorizedPaged[category.key];
    return Object.keys(categoryData.slots).length > 0;
  });

  if (availableCategories.length === 0) {
    return (
      <div className="app-section">
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-4">😴</div>
          <p className="text-lg">{i18n.noSlotsAvailable}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <Tabs defaultValue={availableCategories[0]?.key} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 h-auto p-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-[var(--card-radius)]">
          {availableCategories.map(category => {
            const categoryData = categorizedPaged[category.key];
            const slotsCount = Object.values(categoryData.slots).reduce((sum, times) => sum + times.length, 0);
            
            return (
              <TabsTrigger
                key={category.key}
                value={category.key}
                className="flex-1 min-h-[56px] text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-[calc(var(--card-radius)-4px)] scale-tap"
              >
                <div className="flex flex-col items-center gap-1 py-2">
                  <div className="text-lg">{category.icon}</div>
                  <span className="font-semibold">{category.label}</span>
                  <span className="text-xs opacity-75 bg-background/20 px-2 py-0.5 rounded-full">
                    {slotsCount}
                  </span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {availableCategories.map(category => {
          const categoryData = categorizedPaged[category.key];
          
          return (
            <TabsContent key={category.key} value={category.key} className="space-y-6 mt-0">
              <DateAccordion
                slots={categoryData.slots}
                onSlotClick={onSlotClick}
              />
              
              {categoryData.totalPages > 1 && (
                <Pagination
                  currentPage={categoryData.currentPage}
                  totalPages={categoryData.totalPages}
                  onPageChange={(page) => onPageChange(category.key, page)}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}