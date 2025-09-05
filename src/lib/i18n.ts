export const i18n = {
  // Navigation
  selectPackage: 'Selecionar Pacote',
  viewAvailableSlots: 'Ver Horários Disponíveis',
  
  // Categories
  all: 'Todos',
  afterHours: 'Após as 18h',
  saturdays: 'Sábados', 
  sundaysHolidays: 'Domingos / Feriados',
  
  // Actions
  schedule: 'Agendar',
  alreadyPaid: '✅ Já paguei, Agendar agora',
  wantToPay: '💳 Quero pagar a entrada',
  payNow: 'PAGAR AGORA',
  whatsappContact: 'FALAR NO WHATSAPP',
  changePackage: 'Alterar Pacote',
  
  // Messages
  confirmationTitle: 'Confirmar Agendamento',
  confirmationMessage: (date: string, day: string, time: string) => 
    `Para garantir sua sessão de fotos de Natal no dia **${date} (${day})** às **${time}**, é necessário efetuar o pagamento da entrada. Você já pagou a entrada?`,
  
  paymentTitle: 'Pagamento da Entrada',
  paymentMessage: 'Este horário ainda está disponível para outros clientes. Sua reserva será confirmada apenas após o pagamento. Cartão e Pix confirmam imediatamente, boleto bancário pode levar até 2 dias úteis.',
  
  redirectingIn: (seconds: number) => `Redirecionando em ${seconds} segundos...`,
  
  // Banner
  premiumHoursBanner: 'Os pacotes **Boas Festas** e **Então é Natal** oferecem horários em finais de semana e após horário comercial!',
  
  // Loading & Errors
  loading: 'Carregando horários...',
  errorLoadingSlots: 'Erro ao carregar horários',
  noSlotsAvailable: 'Nenhum horário disponível',
  
  // Package info
  duration: (minutes: number) => `${minutes} minutos`,
  
  // Days of week
  days: {
    Dom: 'Domingo',
    Seg: 'Segunda',
    Ter: 'Terça', 
    Qua: 'Quarta',
    Qui: 'Quinta',
    Sex: 'Sexta',
    Sáb: 'Sábado'
  }
};