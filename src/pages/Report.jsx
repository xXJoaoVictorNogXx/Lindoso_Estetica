import { useParams, useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";
import { Button } from "../components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect } from "react";
import { formatDate } from "../lib/utils";

export function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFinishedServices } = useServices();
  
  const service = getFinishedServices().find(s => s.id === id);

  useEffect(() => {
    // Hide BottomNav when viewing report for better printing
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';
    
    // Also remove max-width on main container if we are in print mode
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white !important; color: black !important; }
        .no-print { display: none !important; }
        main { max-width: none !important; border: none !important; box-shadow: none !important; margin: 0 !important; }
        .print-container { padding: 0 !important; }
        * { color: black !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (nav) nav.style.display = 'flex';
      document.head.removeChild(style);
    };
  }, []);

  if (!service) {
    return (
      <div className="p-4 text-center">
        <p>Serviço não encontrado.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Voltar</Button>
      </div>
    );
  }

  const { client, vehicle, serviceDetails, timestamps, nextReminderDate, photos } = service;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black print-container">
      {/* HEADER FIXO - NO PRINT */}
      <div className="no-print bg-zinc-950 p-4 sticky top-0 flex items-center justify-between border-b border-zinc-800 z-50">
        <Button variant="ghost" className="text-white hover:bg-zinc-800 p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Printer className="w-4 h-4" />
          Gerar PDF
        </Button>
      </div>

      {/* ÁREA DE IMPRESSÃO - FORMATO A4 */}
      <div className="bg-white mx-auto p-8 font-sans" style={{ maxWidth: '800px' }}>
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Lindoso Estética Automotiva" className="h-24 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
          {/* Fallback caso a imagem não carregue: */}
          <div className="h-24 hidden flex-col items-center justify-center logo-fallback">
            <h1 className="text-3xl font-bold tracking-widest text-black">LINDOSO</h1>
            <p className="text-xs uppercase tracking-widest">Estética Automotiva</p>
          </div>
        </div>

        {/* TÍTULO */}
        <div className="bg-zinc-800 text-white p-3 mb-6 rounded">
          <h2 className="text-xl font-bold m-0">Relatório de Serviço Automotivo</h2>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Dados do Cliente</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><strong>Nome:</strong> {client.name}</li>
                <li><strong>Telefone:</strong> {client.phone}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Dados do Veículo</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><strong>Marca:</strong> {vehicle.brand}</li>
                <li><strong>Modelo:</strong> {vehicle.model}</li>
                <li><strong>Cor:</strong> {vehicle.color}</li>
                <li><strong>Placa:</strong> <span className="uppercase">{vehicle.plate}</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Detalhes do Serviço</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><strong>Data do Serviço:</strong> {formatDate(timestamps.start)}</li>
                <li><strong>Hora de Início:</strong> {new Date(timestamps.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</li>
                <li><strong>Hora de Conclusão:</strong> {new Date(timestamps.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
             {photos.after.length > 0 ? (
               <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                  {/* Substituir por <img src={photos.after[0]} /> no app real */}
                  [Foto Principal]
               </div>
             ) : (
               <div className="text-gray-400">Sem foto do veículo</div>
             )}
          </div>
        </div>

        {/* SERVIÇOS REALIZADOS TÍTULO */}
        <div className="bg-zinc-800 text-white p-3 mb-6 rounded">
          <h2 className="text-xl font-bold m-0">Serviços Realizados</h2>
        </div>

        {/* CHECKLISTS GRID */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Diagnóstico</h3>
              <ul className="text-sm space-y-1">
                <li>{serviceDetails.diagnostico === 'Limpeza Leve' ? '[ X ]' : '[   ]'} Limpeza Leve</li>
                <li>{serviceDetails.diagnostico === 'Limpeza Média' ? '[ X ]' : '[   ]'} Limpeza Média</li>
                <li>{serviceDetails.diagnostico === 'Limpeza Pesada' ? '[ X ]' : '[   ]'} Limpeza Pesada</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Tipo de Lavagem</h3>
              <ul className="text-sm space-y-1">
                <li>{serviceDetails.tipoLavagem === 'Lavagem Ecológica' ? '[ X ]' : '[   ]'} Lavagem Ecológica</li>
                <li>{serviceDetails.tipoLavagem === 'Lavagem Tradicional' ? '[ X ]' : '[   ]'} Lavagem Tradicional</li>
                <li>{serviceDetails.tipoLavagem === 'Lavagem Detalhada' ? '[ X ]' : '[   ]'} Lavagem Detalhada</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Nível de Detalhe</h3>
              <ul className="text-sm space-y-1">
                <li>{serviceDetails.nivelDetalhe === 'Express - Simples' ? '[ X ]' : '[   ]'} Express - Simples</li>
                <li>{serviceDetails.nivelDetalhe === 'Detail - Intermediária' ? '[ X ]' : '[   ]'} Detail - Intermediária</li>
                <li>{serviceDetails.nivelDetalhe === 'Premium - Completa' ? '[ X ]' : '[   ]'} Premium - Completa</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Adicionais</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {serviceDetails.extras.length > 0 ? (
                  serviceDetails.extras.map((extra, idx) => (
                    <li key={idx}><strong>{extra.name}</strong></li>
                  ))
                ) : (
                  <li>Nenhum adicional</li>
                )}
              </ul>
            </div>
          </div>

        </div>

        {/* PRÓXIMOS PASSOS */}
        <div className="bg-zinc-800 text-white p-3 mb-4 rounded">
          <h2 className="text-xl font-bold m-0">Próximos Passos</h2>
        </div>
        <div className="bg-blue-50 text-blue-900 p-4 rounded mb-8 border border-blue-200">
          <p className="text-sm">
            Sua satisfação é nossa prioridade! Esperamos que você aproveite o resultado.
            Para manter seu veículo sempre em perfeito estado e higiene, recomendamos o próximo procedimento para: <strong>{formatDate(nextReminderDate)}</strong>.
          </p>
        </div>

        {/* REGISTROS FOTOGRÁFICOS */}
        <div className="bg-zinc-800 text-white p-3 mb-4 rounded" style={{ pageBreakBefore: 'auto' }}>
          <h2 className="text-xl font-bold m-0">Registros</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Antes</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                [Foto Antes]
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Depois</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                [Foto Depois]
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 pt-8 border-t border-gray-200 text-gray-500 text-sm">
          Obrigado por confiar seus cuidados à Lindoso Estética Automotiva!
        </div>

      </div>
    </div>
  );
}
