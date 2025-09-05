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
import { useAvailability } from '../hooks/useAvailability';
import { buildWhatsAppDeepLink } from '../lib/scheduling';
import { i18n } from '../lib/i18n';
import type { CategoryKey } from '../types';

export default function SchedulingPage() {
  const { packageSlug } = useParams<{ packageSlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const { categorizedPaged, loading, error, packageMeta } = useAvailability(
    packageSlug,
    currentPage
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
      <div className="min-h-screen bg-background">
        <HeaderLogo />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">{i18n.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderLogo />
        <div className="text-center py-12 px-4">
          <p className="text-destructive mb-4">{i18n.errorLoadingSlots}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!packageMeta || !categorizedPaged) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderLogo />
        <div className="text-center py-12 px-4">
          <p className="text-muted-foreground">{i18n.noSlotsAvailable}</p>
        </div>
        <WhatsAppFAB />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <HeaderLogo />
      
      <TopBanner packageSlug={packageSlug} onChangePackage={handleChangePackage} />
      
      <PackageInfo package={packageMeta} />
      
      <CategoryTabs
        categorizedPaged={categorizedPaged}
        onSlotClick={handleSlotClick}
        onPageChange={handlePageChange}
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