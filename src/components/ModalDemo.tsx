import { useState } from 'react';
import { Button } from './ui/button';
import { TouchFriendlyModal } from './TouchFriendlyModal';
import { Calendar, Clock } from 'lucide-react';

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAlreadyPaid = () => {
    console.log('Já paguei - Abrindo WhatsApp');
    setIsOpen(false);
  };

  const handleWantToPay = () => {
    console.log('Quero pagar agora');
    setIsOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Modal Touch-Friendly Demo</h2>
        <p className="text-muted-foreground">
          Teste o novo modal com efeitos de touch nativos
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full h-14 text-lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Testar Modal Touch-Friendly
        </Button>
        
        <div className="bg-muted/20 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Funcionalidades:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Puxar para baixo para fechar</li>
            <li>• Toque fora para fechar</li>
            <li>• Animações suaves e nativas</li>
            <li>• Feedback tátil (haptic)</li>
            <li>• Design responsivo</li>
            <li>• Indicador visual de arrastar</li>
          </ul>
        </div>
      </div>

      <TouchFriendlyModal
        open={isOpen}
        onOpenChange={setIsOpen}
        dateLabel="25/12"
        dayLabel="quarta-feira"
        time="14:30"
        onAlreadyPaid={handleAlreadyPaid}
        onWantToPay={handleWantToPay}
      />
    </div>
  );
}
