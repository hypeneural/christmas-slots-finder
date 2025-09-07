import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HeaderLogo } from '../components/HeaderLogo';
import { TopBanner } from '../components/TopBanner';
import { PackageInfo } from '../components/PackageInfo';
import { CategoryTabs } from '../components/CategoryTabs';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PaymentDialog } from '../components/PaymentDialog';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { FiltersBar } from '../components/FiltersBar';
import { FiltersSheet } from '../components/FiltersSheet';
import { useAvailability } from '../hooks/useAvailability';
import { useFilters } from '../hooks/useFilters';
import { buildWhatsAppDeepLink } from '../lib/scheduling';
import { i18n } from '../lib/i18n';
import type { CategoryKey } from '../types';

export default function SchedulingPage() {
  const { packageSlug } = useParams<{ packageSlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
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
  
  const { categorizedPaged, loading, error, packageMeta } = useAvailability(
    packageSlug,
    currentPage,
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

  const handlePageChange = (category: CategoryKey, page: number) => {
    setSearchParams({ page: page.toString() });
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
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <div className="text-4xl mb-4">😞</div>
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
          <div className="text-4xl mb-4">📅</div>
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
      
      <FiltersBar
        filters={filters}
        activeCount={activeCount}
        hasActiveFilters={hasActiveFilters}
        onOpenFilters={openSheet}
        onClearFilters={clearFilters}
      />
      
      <CategoryTabs
        categorizedPaged={categorizedPaged}
        onSlotClick={handleSlotClick}
        onPageChange={handlePageChange}
      />
      
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