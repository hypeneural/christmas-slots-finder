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
    availableFilters,
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

  const isDirectWhatsAppFlow = packageMeta?.customerFlow?.mode === 'already_paid';
  const cta = packageMeta?.cta;

  const openWhatsAppForSlot = (slot: {
    dateLabel: string;
    dayLabel: string;
    time: string;
  }) => {
    const whatsappUrl = buildWhatsAppDeepLink(slot.dateLabel, slot.dayLabel, slot.time, {
      packageName: packageMeta?.name,
      phoneNumber: stringFrom(cta?.whatsappNumber),
      template: stringFrom(cta?.whatsappMessageTemplate),
    });

    window.open(whatsappUrl, '_blank');
  };

  const handleSlotClick = (date: string, time: string) => {
    const parsedDate = parseISO(date);
    const dateLabel = format(parsedDate, 'dd/MM', { locale: ptBR });
    const dayLabel = format(parsedDate, 'EEEE', { locale: ptBR });

    setSelectedSlot({ date, time, dateLabel, dayLabel });

    if (isDirectWhatsAppFlow) {
      openWhatsAppForSlot({ dateLabel, dayLabel, time });
      return;
    }

    // Otherwise, show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleAlreadyPaid = () => {
    if (!selectedSlot) return;

    setShowConfirmDialog(false);
    openWhatsAppForSlot(selectedSlot);
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

      {/* Indicador do fluxo vindo do CRM. */}
      {isDirectWhatsAppFlow && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">OK</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 text-base">Pagamento confirmado</h3>
              <p className="text-green-700 text-sm">Clique em qualquer horario para agendar diretamente no WhatsApp</p>
            </div>
          </div>
        </div>
      )}

      <PackageInfo
        package={packageMeta}
        onChangePackage={isDirectWhatsAppFlow ? undefined : handleChangePackage}
      />

      <CompactControls
        categorizedPaged={categorizedPaged}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filters={filters}
        activeFiltersCount={activeCount}
        hasActiveFilters={hasActiveFilters}
        availableFilters={availableFilters}
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
        availableFilters={availableFilters}
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
            packageName={packageMeta.name}
            paymentUrl={stringFrom(cta?.paymentUrl)}
            whatsappNumber={stringFrom(cta?.whatsappNumber)}
            whatsappMessageTemplate={stringFrom(cta?.whatsappMessageTemplate)}
          />
        </>
      )}
    </div>
  );
}

function stringFrom(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}
