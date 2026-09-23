import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/input";
import { Camera, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";

const EXTRAS_LIST = [
  { id: 'hig_painel', name: 'Higienização Painel', price: 10 },
  { id: 'enceramento', name: 'Enceramento', price: 10 },
  { id: 'rev_plasticos', name: 'Revitalização de Plásticos', price: 20 },
  { id: 'hid_couro', name: 'Hidratação dos Couros', price: 50 },
  { id: 'vitrificacao', name: 'Manutenção de Vitrificação(~6 Meses)', price: 150 },
];

export function NewService() {
  const { startService } = useServices();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Client
    clientName: "",
    phone: "",
    // Vehicle
    brand: "",
    carModel: "",
    color: "",
    plate: "",
    category: "Hatch",
    // Service Details
    diagnostico: "Limpeza Média",
    tipoLavagem: "Lavagem Tradicional",
    nivelDetalhe: "Detail - Intermediária",
    basePrice: 50,
  });

  const [selectedExtras, setSelectedExtras] = useState([]);
  
  const [photos, setPhotos] = useState({
    before: []
  });

  const [success, setSuccess] = useState(false);

  const totalPrice = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((acc, extra) => acc + extra.price, 0);
    return Number(formData.basePrice) + extrasTotal;
  }, [formData.basePrice, selectedExtras]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    startService({
      client: {
        name: formData.clientName,
        phone: formData.phone
      },
      vehicle: {
        brand: formData.brand,
        model: formData.carModel,
        color: formData.color,
        plate: formData.plate,
        category: formData.category
      },
      serviceDetails: {
        diagnostico: formData.diagnostico,
        tipoLavagem: formData.tipoLavagem,
        nivelDetalhe: formData.nivelDetalhe,
        basePrice: Number(formData.basePrice),
        extras: selectedExtras,
        checklist: [] // Can be expanded later
      },
      totalPrice: totalPrice,
      photos: { 
        before: photos.before.length > 0 ? photos.before : [] 
      }
    });

    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) return prev.filter(e => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const handlePhotoClick = () => {
    // MOCK: Adds a placeholder image url
    setPhotos(prev => ({
      ...prev,
      before: [...prev.before, `mock-before-${Date.now()}`]
    }));
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Lavagem Iniciada!</h2>
        <p className="text-zinc-400">O veículo está em andamento.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300 pb-24">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo Atendimento</h1>
        <p className="text-sm text-zinc-400">Registre a entrada do veículo</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* DADOS DO CLIENTE */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-400">Dados do Cliente</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome</Label>
                <Input id="clientName" name="clientName" required value={formData.clientName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DADOS DO VEÍCULO */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-400">Dados do Veículo</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" name="brand" placeholder="Ex: VW" required value={formData.brand} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carModel">Modelo</Label>
                  <Input id="carModel" name="carModel" placeholder="Ex: Polo" required value={formData.carModel} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input id="color" name="color" placeholder="Ex: Prata" required value={formData.color} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input id="plate" name="plate" className="uppercase" required value={formData.plate} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria do Carro</Label>
                <select 
                  id="category" name="category" required value={formData.category} onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="Hatch">Hatch</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Caminhonete">Caminhonete</option>
                  <option value="Moto">Moto</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DETALHES DO SERVIÇO */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-400">Detalhes do Serviço</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <select id="diagnostico" name="diagnostico" value={formData.diagnostico} onChange={handleChange} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100">
                  <option value="Limpeza Leve">Limpeza Leve</option>
                  <option value="Limpeza Média">Limpeza Média</option>
                  <option value="Limpeza Pesada">Limpeza Pesada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoLavagem">Tipo de Lavagem</Label>
                <select id="tipoLavagem" name="tipoLavagem" value={formData.tipoLavagem} onChange={handleChange} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100">
                  <option value="Lavagem Ecológica">Lavagem Ecológica</option>
                  <option value="Lavagem Tradicional">Lavagem Tradicional</option>
                  <option value="Lavagem Detalhada">Lavagem Detalhada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivelDetalhe">Nível de Detalhe</Label>
                <select id="nivelDetalhe" name="nivelDetalhe" value={formData.nivelDetalhe} onChange={handleChange} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100">
                  <option value="Express - Simples">Express - Simples</option>
                  <option value="Detail - Intermediária">Detail - Intermediária</option>
                  <option value="Premium - Completa">Premium - Completa</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Valor Base (R$)</Label>
                <Input id="basePrice" name="basePrice" type="number" required value={formData.basePrice} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* EXTRAS (UPSELL) */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-400">Serviços Adicionais</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {EXTRAS_LIST.map(extra => {
                const isSelected = selectedExtras.some(e => e.id === extra.id);
                return (
                  <div key={extra.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'}`}
                    onClick={() => toggleExtra(extra)}
                  >
                    <span className="text-sm font-medium text-white">{extra.name}</span>
                    <span className="text-sm text-indigo-400">+{formatCurrency(extra.price)}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* FOTOS ESTADO INICIAL */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-400">Estado Inicial (Antes)</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos.before.map((p, idx) => (
              <div key={idx} className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                <Camera className="w-6 h-6 text-zinc-600" />
              </div>
            ))}
            <div 
              onClick={handlePhotoClick}
              className="aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800 transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer text-zinc-400"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium uppercase">Adicionar</span>
            </div>
          </div>
        </section>

        {/* TOTAL E SUBMIT */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 max-w-md mx-auto z-40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-400">Total Previsto:</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(totalPrice)}</span>
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">
            Iniciar Lavagem
          </Button>
        </div>
      </form>
    </div>
  );
}
