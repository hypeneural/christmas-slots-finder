import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HeaderLogo } from '../components/HeaderLogo';
import { TopBanner } from '../components/TopBanner';
import { PackageInfo } from '../components/PackageInfo';
import { CompactControls } from '../components/CompactControls';
import { DateAccordion } from '../components/DateAccordion';
import { InfiniteScrollContainer } from '../components/InfiniteScrollContainer';
import { OptimizedTouchModal } from '../components/OptimizedTouchModal';
import { OptimizedPaymentModal } from '../components/OptimizedPaymentModal';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { FiltersSheet } from '../components/FiltersSheet';
import { PullToRefresh } from '../components/PullToRefresh';
import { SlotListSkeleton, HeaderSkeleton } from '../components/SkeletonLoader';
import { useInfiniteAvailability } from '../hooks/useInfiniteAvailability';
import { useFilters } from '../hooks/useFilters';
import { buildWhatsAppDeepLink } from '../lib/scheduling';
import { i18n } from '../lib/i18n';
import { Loader2, Frown, CalendarX } from 'lucide-react';
import type { CategoryKey } from '../types';

export default function SchedulingPage() {
  const { packageSlug } = useParams<{ packageSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came with /pg in URL (already paid)
  const isAlreadyPaid = location.pathname.includes('/pg');
  
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
    loadMore,
    hasNextPage,
    currentPage,
    totalPages
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
    
    // If user came with /pg in URL, redirect directly to WhatsApp
    if (isAlreadyPaid) {
      const whatsappUrl = buildWhatsAppDeepLink(dateLabel, dayLabel, time);
      window.open(whatsappUrl, '_blank');
      return;
    }
    
    // Otherwise, show confirmation dialog
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

  const handleRefresh = async () => {
    // Trigger a refresh of the data
    window.location.reload();
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
        <HeaderSkeleton />
        <div className="app-section">
          <SlotListSkeleton />
        </div>
        <WhatsAppFAB />
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
      
      {/* Already Paid Indicator */}
      {isAlreadyPaid && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 text-base">Pagamento Confirmado</h3>
              <p className="text-green-700 text-sm">Clique em qualquer horário para agendar diretamente no WhatsApp</p>
            </div>
          </div>
        </div>
      )}
      
      <PackageInfo 
        package={packageMeta} 
        onChangePackage={isAlreadyPaid ? undefined : handleChangePackage} 
      />
      
      <CompactControls
        categorizedPaged={categorizedPaged}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filters={filters}
        activeFiltersCount={activeCount}
        hasActiveFilters={hasActiveFilters}
        onApplyFilters={setFilters}
        onClearFilters={clearFilters}
      />
      
      <div className="app-section">
        <PullToRefresh onRefresh={handleRefresh}>
          {(() => {
            const categoryData = categorizedPaged[selectedCategory];
            
            return (
              <InfiniteScrollContainer
                hasMore={hasNextPage}
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
        </PullToRefresh>
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
          <OptimizedTouchModal
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            dateLabel={selectedSlot.dateLabel}
            dayLabel={selectedSlot.dayLabel}
            time={selectedSlot.time}
            onAlreadyPaid={handleAlreadyPaid}
            onWantToPay={handleWantToPay}
          />
          
          <OptimizedPaymentModal
            open={showPaymentDialog}
            onOpenChange={setShowPaymentDialog}
            dateLabel={selectedSlot.dateLabel}
            dayLabel={selectedSlot.dayLabel}
            time={selectedSlot.time}
          />
        </>
      )}
    </div>
  );
}