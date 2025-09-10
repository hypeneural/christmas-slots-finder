import { useState } from 'react';
import { Button } from './ui/button';
import { TouchFriendlyPaymentModal } from './TouchFriendlyPaymentModal';
import { CreditCard, MessageCircle, Timer } from 'lucide-react';

export function PaymentModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Modal de Pagamento Touch-Friendly</h2>
        <p className="text-muted-foreground">
          Teste o novo modal de pagamento com contagem regressiva
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full h-14 text-lg bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Testar Modal de Pagamento
        </Button>
        
        <div className="bg-muted/20 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Funcionalidades:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Contagem regressiva de 10 segundos</li>
            <li>• Redirecionamento automático para pagamento</li>
            <li>• Botão de contato via WhatsApp</li>
            <li>• Puxar para baixo para fechar</li>
            <li>• Design consistente com o modal principal</li>
            <li>• Informações da sessão selecionada</li>
          </ul>
        </div>
      </div>

      <TouchFriendlyPaymentModal
        open={isOpen}
        onOpenChange={setIsOpen}
        dateLabel="25/12"
        dayLabel="quarta-feira"
        time="14:30"
      />
    </div>
  );
}
