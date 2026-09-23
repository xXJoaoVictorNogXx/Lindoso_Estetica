import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewService } from "./pages/NewService";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Report } from "./pages/Report";
import { Login } from "./pages/Login";
import { RegisterPastService } from "./pages/RegisterPastService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark if nothing is saved
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <ServicesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewService />} />
            <Route path="past-service" element={<RegisterPastService />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/report/:id" element={<Report />} />
          {/* Catch-all redirect back to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ServicesProvider>
  );
}

export default App;
