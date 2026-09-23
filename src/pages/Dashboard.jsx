import { useState } from "react";
import { useServices } from "../context/ServicesContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatCurrency, formatDate } from "../lib/utils";
import { MessageCircle, DollarSign, Droplets, CalendarDays, Camera, CheckCircle2, X } from "lucide-react";
import { Button } from "../components/ui/button";

export function Dashboard() {
  const { getFinancialSummary, getReminders, getActiveServices, finishService } = useServices();
  const summary = getFinancialSummary();
  const reminders = getReminders();
  const activeServices = getActiveServices();

  const [finishingService, setFinishingService] = useState(null);
  const [afterPhotos, setAfterPhotos] = useState([]);

  const handleWhatsapp = (phone, name) => {
    const text = `Olá ${name}! Vimos que já faz um tempo desde a sua última lavagem. Que tal agendar um horário conosco para deixar seu carro brilhando novamente?`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFinishPhotoClick = () => {
    setAfterPhotos(prev => [...prev, `mock-after-${Date.now()}`]);
  };

  const handleCompleteService = () => {
    if (finishingService) {
      finishService(finishingService.id, afterPhotos);
      setFinishingService(null);
      setAfterPhotos([]);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header className="py-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">Resumo do seu negócio hoje</p>
      </header>

      {/* Resumo Financeiro */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-zinc-900 border-indigo-500/20">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-400" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.todayRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-zinc-400" />
              Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.monthRevenue)}</p>
          </CardContent>
        </Card>
      </section>

      {/* SERVIÇOS EM ANDAMENTO */}
      {activeServices.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Em Andamento ({activeServices.length})
          </h2>
          <div className="space-y-3">
            {activeServices.map(service => (
              <Card key={service.id} className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{service.vehicle.model}</h3>
                    <p className="text-sm text-zinc-400">{service.client.name} • {service.vehicle.plate.toUpperCase()}</p>
                    <div className="text-xs text-emerald-400 mt-1 font-medium">Lavando desde {new Date(service.timestamps.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  <Button onClick={() => setFinishingService(service)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Finalizar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Lembretes do Dia */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Lembretes de Retorno</h2>
          <span className="text-xs font-medium bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
            {reminders.length} Pendentes
          </span>
        </div>

        <div className="space-y-3">
          {reminders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-zinc-500">
                Nenhum lembrete para hoje!
              </CardContent>
            </Card>
          ) : (
            reminders.map((service) => (
              <Card key={service.id} className="overflow-hidden border-zinc-800">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-white">{service.client.name}</h3>
                      <p className="text-xs text-zinc-400">
                        {service.vehicle.model} • {service.vehicle.plate}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-400/10 px-2 py-1 rounded-sm">
                      Vencido
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mb-4">
                    Último serviço: {service.serviceDetails.nivelDetalhe} em {formatDate(service.timestamps.end)}
                  </div>
                  <Button 
                    variant="default" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    onClick={() => handleWhatsapp(service.client.phone, service.client.name)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Cobrar via WhatsApp
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* MODAL DE FINALIZAR SERVIÇO */}
      {finishingService && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 pb-safe">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-white">Finalizar Lavagem</h2>
                <p className="text-xs text-zinc-400">{finishingService.vehicle.model} ({finishingService.vehicle.plate.toUpperCase()})</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setFinishingService(null); setAfterPhotos([]); }}>
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm uppercase font-bold tracking-wider text-emerald-400">Estado Final (Depois)</h3>
                <div className="grid grid-cols-3 gap-3">
                  {afterPhotos.map((p, idx) => (
                    <div key={idx} className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      <Camera className="w-6 h-6 text-emerald-500" />
                    </div>
                  ))}
                  <div 
                    onClick={handleFinishPhotoClick}
                    className="aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-emerald-500 hover:bg-zinc-800 transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer text-zinc-400"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium uppercase">Adicionar</span>
                  </div>
                </div>
              </section>

              <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
                <span className="text-zinc-400">Total a Receber:</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(finishingService.totalPrice)}</span>
              </div>

              <Button onClick={handleCompleteService} className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Concluir Atendimento
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
