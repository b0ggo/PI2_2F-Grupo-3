import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Login from "./pages/Login/Login";
import CadastroProdutor from "./pages/CadastroProdutor/CadastroProdutor";
import CadastroEmpresa from "./pages/CadastroEmpresa/CadastroEmpresa";
import PaginaInicial from "./pages/PaginaInicial/PaginaInicial";
import CadastrarAnimal from "./pages/CadastrarAnimal/CadastrarAnimal";
import CadastrarLotes from "./pages/CadastroLotes/CadastrarLotes";
import Vacinacao from "./pages/Vacinacao/Vacinacao";
import ChatEmpresas from "./pages/ChatEmpresas/ChatEmpresas";
import Perfil from "./pages/perfil/Perfil";
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil";
import Consultar from "./pages/Consultar/Consultar";
import Alertas from "./pages/Alertas/Alertas";
import { ROUTES } from "./constants/routes.js";

function Protegido({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.CADASTRO_PRODUTOR} element={<CadastroProdutor />} />
        <Route path={ROUTES.CADASTRO_EMPRESA} element={<CadastroEmpresa />} />
        <Route path={ROUTES.HOME} element={<Protegido><PaginaInicial /></Protegido>} />
        <Route path={ROUTES.CADASTRO_ANIMAL} element={<Protegido><CadastrarAnimal /></Protegido>} />
        <Route path={ROUTES.CADASTRO_LOTES} element={<Protegido><CadastrarLotes /></Protegido>} />
        <Route path={ROUTES.VACINACAO} element={<Protegido><Vacinacao /></Protegido>} />
        <Route path={ROUTES.CHAT} element={<Protegido><ChatEmpresas /></Protegido>} />
        <Route path={ROUTES.PERFIL} element={<Protegido><Perfil /></Protegido>} />
        <Route path={ROUTES.EDITAR_PERFIL} element={<Protegido><EditarPerfil /></Protegido>} />
        <Route path={ROUTES.CONSULTAR} element={<Protegido><Consultar /></Protegido>} />
        <Route path={ROUTES.NOTIFICACAO} element={<Protegido><Alertas /></Protegido>} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
