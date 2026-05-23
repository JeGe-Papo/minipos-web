
import './App.css'
import { useState } from 'react'
import './App.css'
import DepartamentsPage from "./pages/DepartamentsPage";
import CustomersPage from './pages/CustomersPage';
import PanCocoPage from './pages/PanCocoPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/About';
import MainLayout from "./layouts/MainLayout";
import SidebarMenu from "./components/SidebarMenu";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  function renderContent() {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;
      case "customers":
        return <CustomersPage />;
      case "departments":
        return <DepartamentsPage />;
      case "pan-coco":
        return <PanCocoPage />;
      case "about":
        return <AboutPage />;
      default:
        return <CustomersPage />;
    }
  }


  const sidebar = (
    <div>
      <SidebarMenu current={page} onChange={setPage} />
      <div className="mt-6 border-t pt-4">
        <p className="text-xs text-gray-500 mb-2">Hola, {user?.username}</p>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <PrivateRoute fallback={<LoginPage onSuccess={() => { }} />}>
      <MainLayout sidebar={sidebar} content={renderContent()} />
    </PrivateRoute>
  );

}

export default App

{/* 
    //*<div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-sky-400 drop-shadow-lg">
        ¡Tailwind funcionando!
      </h1>

      <PanCoco name="jaider" />
      <br />
      <br />

      <Profile
        name="Jaider Guisamano "
        semester={5}
        Academic="Sistema"
      />
    </div>*/}