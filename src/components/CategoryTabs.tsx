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
    { key: 'all' as CategoryKey, label: i18n.all },
    { key: 'afterHours' as CategoryKey, label: i18n.afterHours },
    { key: 'saturdays' as CategoryKey, label: i18n.saturdays },
    { key: 'sundaysHolidays' as CategoryKey, label: i18n.sundaysHolidays },
  ];

  // Only show tabs that have content
  const availableCategories = categories.filter(category => {
    const categoryData = categorizedPaged[category.key];
    return Object.keys(categoryData.slots).length > 0;
  });

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{i18n.noSlotsAvailable}</p>
      </div>
    );
  }

  return (
    <div className="mx-4">
      <Tabs defaultValue={availableCategories[0]?.key} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 bg-card/50 backdrop-blur">
          {availableCategories.map(category => {
            const categoryData = categorizedPaged[category.key];
            const slotsCount = Object.values(categoryData.slots).reduce((sum, times) => sum + times.length, 0);
            
            return (
              <TabsTrigger
                key={category.key}
                value={category.key}
                className="text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{category.label}</span>
                  <span className="text-xs opacity-75">({slotsCount})</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {availableCategories.map(category => {
          const categoryData = categorizedPaged[category.key];
          
          return (
            <TabsContent key={category.key} value={category.key} className="space-y-4">
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