import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DateAccordion } from './DateAccordion';
import { InfiniteScrollContainer } from './InfiniteScrollContainer';
import { i18n } from '../lib/i18n';
import { Calendar, Moon, Target, Sparkles, Frown } from 'lucide-react';
import type { CategorizedPaged, CategoryKey } from '../types';

interface CategoryTabsProps {
  categorizedPaged: CategorizedPaged;
  onSlotClick: (date: string, time: string) => void;
  onLoadMore: (category: CategoryKey) => void;
  loadingMore?: boolean;
}

export function CategoryTabs({ categorizedPaged, onSlotClick, onLoadMore, loadingMore = false }: CategoryTabsProps) {
  const categories = [
    { key: 'all' as CategoryKey, label: i18n.all, icon: Calendar },
    { key: 'afterHours' as CategoryKey, label: i18n.afterHours, icon: Moon },
    { key: 'saturdays' as CategoryKey, label: i18n.saturdays, icon: Target },
    { key: 'sundaysHolidays' as CategoryKey, label: i18n.sundaysHolidays, icon: Sparkles },
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
          <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
            <Frown className="w-8 h-8" />
          </div>
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
                  <category.icon className="w-5 h-5" />
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
          const hasMore = categoryData.currentPage < categoryData.totalPages;
          
          return (
            <TabsContent key={category.key} value={category.key} className="space-y-6 mt-0">
              <InfiniteScrollContainer
                hasMore={hasMore}
                loading={loadingMore}
                onLoadMore={() => onLoadMore(category.key)}
                threshold={300}
              >
                <DateAccordion
                  slots={categoryData.slots}
                  onSlotClick={onSlotClick}
                />
              </InfiniteScrollContainer>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}