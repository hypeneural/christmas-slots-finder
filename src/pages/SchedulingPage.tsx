import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HeaderLogo } from '../components/HeaderLogo';
import { TopBanner } from '../components/TopBanner';
import { PackageInfo } from '../components/PackageInfo';
import { CompactControls } from '../components/CompactControls';
import { DateAccordion } from '../components/DateAccordion';
import { InfiniteScrollContainer } from '../components/InfiniteScrollContainer';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PaymentDialog } from '../components/PaymentDialog';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { FiltersSheet } from '../components/FiltersSheet';
import { useInfiniteAvailability } from '../hooks/useInfiniteAvailability';
import { useFilters } from '../hooks/useFilters';
import { buildWhatsAppDeepLink } from '../lib/scheduling';
import { i18n } from '../lib/i18n';
import { Loader2, Frown, CalendarX } from 'lucide-react';
import type { CategoryKey } from '../types';

export default function SchedulingPage() {
  const { packageSlug } = useParams<{ packageSlug: string }>();
  const navigate = useNavigate();
  
  // Filters state
  const {
    filters,
    setFilters,
    clearFilters,
    activeCount,
    hasActiveFilters,
    isSheetOpen,
    openSheet,
    closeSheet
  } = useFilters();
  
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  
  const { 
    categorizedPaged, 
    loading, 
    loadingMore,
    error, 
    packageMeta, 
    loadMore 
  } = useInfiniteAvailability(
    packageSlug,
    30, // perPage - increased for mobile
    filters
  );
  
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
    dateLabel: string;
    dayLabel: string;
  } | null>(null);
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleSlotClick = (date: string, time: string) => {
    const parsedDate = parseISO(date);
    const dateLabel = format(parsedDate, 'dd/MM', { locale: ptBR });
    const dayLabel = format(parsedDate, 'EEEE', { locale: ptBR });
    
    setSelectedSlot({ date, time, dateLabel, dayLabel });
    setShowConfirmDialog(true);
  };

  const handleAlreadyPaid = () => {
    if (!selectedSlot) return;
    
    setShowConfirmDialog(false);
    const whatsappUrl = buildWhatsAppDeepLink(
      selectedSlot.dateLabel,
      selectedSlot.dayLabel,
      selectedSlot.time
    );
    window.open(whatsappUrl, '_blank');
  };

  const handleWantToPay = () => {
    setShowConfirmDialog(false);
    setShowPaymentDialog(true);
  };

  const handleLoadMore = async (category: CategoryKey) => {
    await loadMore(category);
  };

  const handleChangePackage = () => {
    navigate('/');
  };

  if (!packageSlug) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="app-container">
        <HeaderLogo />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-lg text-muted-foreground">{i18n.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <HeaderLogo />
        <div className="app-section text-center py-16">
          <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
            <Frown className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-lg text-destructive mb-2">{i18n.errorLoadingSlots}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!packageMeta || !categorizedPaged) {
    return (
      <div className="app-container">
        <HeaderLogo />
        <div className="app-section text-center py-16">
          <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
            <CalendarX className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">{i18n.noSlotsAvailable}</p>
        </div>
        <WhatsAppFAB />
      </div>
    );
  }

  return (
    <div className="app-container">
      <HeaderLogo />
      
      <TopBanner packageSlug={packageSlug} onChangePackage={handleChangePackage} />
      
      <PackageInfo package={packageMeta} />
      
      <CompactControls
        categorizedPaged={categorizedPaged}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filters={filters}
        activeFiltersCount={activeCount}
        hasActiveFilters={hasActiveFilters}
        onOpenFilters={openSheet}
        onClearFilters={clearFilters}
      />
      
      <div className="app-section">
        {(() => {
          const categoryData = categorizedPaged[selectedCategory];
          const hasMore = categoryData.currentPage < categoryData.totalPages;
          
          return (
            <InfiniteScrollContainer
              hasMore={hasMore}
              loading={loadingMore}
              onLoadMore={() => handleLoadMore(selectedCategory)}
              threshold={300}
            >
              <DateAccordion
                slots={categoryData.slots}
                onSlotClick={handleSlotClick}
              />
            </InfiniteScrollContainer>
          );
        })()}
      </div>
      
      <FiltersSheet
        open={isSheetOpen}
        onOpenChange={closeSheet}
        filters={filters}
        onApplyFilters={setFilters}
        onClearFilters={clearFilters}
      />
      
      <WhatsAppFAB />
      
      {selectedSlot && (
        <>
          <ConfirmDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            dateLabel={selectedSlot.dateLabel}
            dayLabel={selectedSlot.dayLabel}
            time={selectedSlot.time}
            onAlreadyPaid={handleAlreadyPaid}
            onWantToPay={handleWantToPay}
          />
          
          <PaymentDialog
            open={showPaymentDialog}
            onOpenChange={setShowPaymentDialog}
          />
        </>
      )}
    </div>
  );
}