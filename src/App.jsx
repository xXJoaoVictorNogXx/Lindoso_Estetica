import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewService } from "./pages/NewService";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Report } from "./pages/Report";

function App() {
  return (
    <ServicesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewService />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/report/:id" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </ServicesProvider>
  );
}

export default App;
