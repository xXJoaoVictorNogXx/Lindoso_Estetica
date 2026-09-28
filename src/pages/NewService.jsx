import { useState, useMemo, useRef } from "react";
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
  { id: 'vitrificacao', name: 'Manutenção Vitrificação', price: 150 },
];

export function NewService() {
  const { startService } = useServices();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    brand: "",
    carModel: "",
    color: "",
    plate: "",
    category: "Hatch",
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
        checklist: []
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => ({
      ...prev,
      before: [...prev.before, ...newPhotos]
    }));
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Lavagem Iniciada!</h2>
        <p className="text-muted-foreground">O veículo está em andamento.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300 pb-32">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Novo Atendimento</h1>
        <p className="text-sm text-muted-foreground">Registre a entrada do veículo</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* DADOS DO CLIENTE */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary px-1">Dados do Cliente</h2>
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-card-foreground">Nome do Cliente</Label>
                <Input id="clientName" name="clientName" required value={formData.clientName} onChange={handleChange} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-card-foreground">Telefone (WhatsApp)</Label>
                <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="bg-background" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DADOS DO VEÍCULO */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary px-1">Dados do Veículo</h2>
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-card-foreground">Marca</Label>
                  <Input id="brand" name="brand" placeholder="Ex: VW" required value={formData.brand} onChange={handleChange} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carModel" className="text-card-foreground">Modelo</Label>
                  <Input id="carModel" name="carModel" placeholder="Ex: Polo" required value={formData.carModel} onChange={handleChange} className="bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-card-foreground">Cor</Label>
                  <Input id="color" name="color" placeholder="Ex: Prata" required value={formData.color} onChange={handleChange} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate" className="text-card-foreground">Placa</Label>
                  <Input id="plate" name="plate" className="uppercase bg-background" required value={formData.plate} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-card-foreground">Categoria do Carro</Label>
                <select 
                  id="category" name="category" required value={formData.category} onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary px-1">Detalhes do Serviço</h2>
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostico" className="text-card-foreground">Diagnóstico</Label>
                <select id="diagnostico" name="diagnostico" value={formData.diagnostico} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="Limpeza Leve">Limpeza Leve</option>
                  <option value="Limpeza Média">Limpeza Média</option>
                  <option value="Limpeza Pesada">Limpeza Pesada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoLavagem" className="text-card-foreground">Tipo de Lavagem</Label>
                <select id="tipoLavagem" name="tipoLavagem" value={formData.tipoLavagem} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="Lavagem Ecológica">Lavagem Ecológica</option>
                  <option value="Lavagem Tradicional">Lavagem Tradicional</option>
                  <option value="Lavagem Detalhada">Lavagem Detalhada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivelDetalhe" className="text-card-foreground">Nível de Detalhe</Label>
                <select id="nivelDetalhe" name="nivelDetalhe" value={formData.nivelDetalhe} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="Express - Simples">Express - Simples</option>
                  <option value="Detail - Intermediária">Detail - Intermediária</option>
                  <option value="Premium - Completa">Premium - Completa</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-card-foreground">Valor Base (R$)</Label>
                <Input id="basePrice" name="basePrice" type="number" required value={formData.basePrice} onChange={handleChange} className="bg-background text-lg font-semibold" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* EXTRAS (UPSELL) */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary px-1">Serviços Adicionais</h2>
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-4 space-y-3">
              {EXTRAS_LIST.map(extra => {
                const isSelected = selectedExtras.some(e => e.id === extra.id);
                return (
                  <div key={extra.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-muted'}`}
                    onClick={() => toggleExtra(extra)}
                  >
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>{extra.name}</span>
                    <span className={isSelected ? 'text-primary font-bold' : 'text-muted-foreground'}>+{formatCurrency(extra.price)}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* FOTOS ESTADO INICIAL */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary px-1">Estado Inicial (Antes)</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos.before.map((p, idx) => (
              <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border relative">
                <img src={p} alt={`Before ${idx}`} className="object-cover w-full h-full" />
              </div>
            ))}
            
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-card border-2 border-dashed border-border hover:border-primary hover:bg-muted transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer text-muted-foreground"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium uppercase">Fotografar</span>
            </div>
          </div>
        </section>

        {/* TOTAL E SUBMIT */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border max-w-md mx-auto z-40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">Total Previsto:</span>
            <span className="text-2xl font-bold text-foreground">{formatCurrency(totalPrice)}</span>
          </div>
          <Button type="submit" className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            Iniciar Lavagem
          </Button>
        </div>
      </form>
    </div>
  );
}
