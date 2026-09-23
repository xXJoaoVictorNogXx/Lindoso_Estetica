import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Search, ChevronRight, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "../lib/utils";
import { Button } from "../components/ui/button";

export function History() {
  const { getFinishedServices } = useServices();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    return getFinishedServices().filter(service => {
      const searchLower = searchTerm.toLowerCase();
      return service.client.name.toLowerCase().includes(searchLower) ||
             service.vehicle.plate.toLowerCase().includes(searchLower);
    }).sort((a, b) => new Date(b.timestamps.end) - new Date(a.timestamps.end));
  }, [getFinishedServices, searchTerm]);

  return (
    <div className="p-4 space-y-6 min-h-screen pb-24">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Histórico</h1>
        <p className="text-sm text-zinc-400">Todos os serviços finalizados</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          placeholder="Buscar por placa ou nome..." 
          className="pl-9 bg-zinc-900 border-zinc-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            Nenhum serviço encontrado.
          </div>
        ) : (
          filteredServices.map(service => (
            <Card 
              key={service.id} 
              className="hover:bg-zinc-800/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{service.client.name}</h3>
                    <div className="text-xs text-zinc-400 mt-1 space-x-2">
                      <span>{service.vehicle.model}</span>
                      <span>•</span>
                      <span className="uppercase">{service.vehicle.plate}</span>
                    </div>
                    <div className="text-xs text-indigo-400 font-medium mt-2">
                      {service.serviceDetails.tipoLavagem}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(service.totalPrice)}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {formatDate(service.timestamps.end)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-xs"
                    onClick={() => navigate(`/report/${service.id}`)}
                  >
                    <FileText className="w-4 h-4" />
                    Ver Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
