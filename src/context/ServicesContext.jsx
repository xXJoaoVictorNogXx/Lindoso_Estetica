import { createContext, useContext, useState, useEffect } from 'react';
import { addDays, addMonths } from 'date-fns';

const ServicesContext = createContext();

export const useServices = () => useContext(ServicesContext);

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('@LindosoEstetica:servicesV2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('@LindosoEstetica:servicesV2', JSON.stringify(services));
  }, [services]);

  const calculateReminder = (serviceType, date) => {
    const baseDate = new Date(date);
    switch (serviceType) {
      case 'Lavagem Simples':
      case 'Express - Simples':
        return addDays(baseDate, 15);
      case 'Lavagem Completa':
      case 'Detail - Intermediária':
      case 'Premium - Completa':
        return addDays(baseDate, 30);
      case 'Manutenção de Vitrificação(~6 Meses)':
        return addMonths(baseDate, 6);
      default:
        return addDays(baseDate, 30);
    }
  };

  const startService = (serviceData) => {
    const newService = {
      id: Date.now().toString(),
      status: 'EM_ANDAMENTO',
      client: serviceData.client, // { name, phone }
      vehicle: serviceData.vehicle, // { brand, model, color, plate, category }
      serviceDetails: serviceData.serviceDetails, // { diagnostico, tipoLavagem, nivelDetalhe, basePrice, extras: [{name, price}] }
      totalPrice: serviceData.totalPrice,
      timestamps: { 
        start: new Date().toISOString(), 
        end: null 
      },
      nextReminderDate: null, // calculated at the end
      photos: { 
        before: serviceData.photos.before || [], 
        after: [], 
        main: '' 
      }
    };
    
    setServices(prev => [newService, ...prev]);
  };

  const finishService = (serviceId, afterPhotos) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const endDate = new Date().toISOString();
        return {
          ...s,
          status: 'FINALIZADO',
          timestamps: { ...s.timestamps, end: endDate },
          nextReminderDate: calculateReminder(s.serviceDetails.nivelDetalhe, endDate).toISOString(),
          photos: { ...s.photos, after: afterPhotos || [] }
        };
      }
      return s;
    }));
  };

  const updateService = (serviceId, updates) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...updates } : s));
  };

  const getActiveServices = () => services.filter(s => s.status === 'EM_ANDAMENTO');
  
  const getFinishedServices = () => services.filter(s => s.status === 'FINALIZADO');

  const getReminders = () => {
    const today = new Date();
    return getFinishedServices().filter(s => s.nextReminderDate && new Date(s.nextReminderDate) <= today);
  };

  const getFinancialSummary = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const finished = getFinishedServices();

    const todayServices = finished.filter(s => {
      const d = new Date(s.timestamps.end);
      return d.getDate() === today.getDate() && 
             d.getMonth() === currentMonth && 
             d.getFullYear() === currentYear;
    });

    const monthServices = finished.filter(s => {
      const d = new Date(s.timestamps.end);
      return d.getMonth() === currentMonth && 
             d.getFullYear() === currentYear;
    });

    return {
      todayRevenue: todayServices.reduce((acc, curr) => acc + Number(curr.totalPrice), 0),
      monthRevenue: monthServices.reduce((acc, curr) => acc + Number(curr.totalPrice), 0),
      totalWashes: monthServices.length
    };
  };

  return (
    <ServicesContext.Provider value={{
      services,
      startService,
      finishService,
      updateService,
      getActiveServices,
      getFinishedServices,
      getReminders,
      getFinancialSummary
    }}>
      {children}
    </ServicesContext.Provider>
  );
};
