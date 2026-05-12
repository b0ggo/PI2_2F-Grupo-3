import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import PaginaInicial from "./pages/PaginaInicial/PaginaInicial";
import CadastrarAnimal from "./pages/CadastrarAnimal/CadastrarAnimal";
import CadastrarLotes from "./pages/CadastroLotes/CadastrarLotes";
import Vacinacao from "./pages/Vacinacao/Vacinacao";
import ChatEmpresas from "./pages/ChatEmpresas/ChatEmpresas";
import Perfil from "./pages/perfil/Perfil";
import Consultar from "./pages/Consultar/Consultar";
import Alertas from "./pages/Alertas/Alertas";
import { ROUTES } from "./constants/routes.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.HOME} element={<PaginaInicial />} />
        <Route path={ROUTES.CADASTRO_ANIMAL} element={<CadastrarAnimal />} />
        <Route path={ROUTES.CADASTRO_LOTES} element={<CadastrarLotes />} />
        <Route path={ROUTES.VACINACAO} element={<Vacinacao />} />
        <Route path={ROUTES.CHAT} element={<ChatEmpresas />} />
        <Route path={ROUTES.PERFIL} element={<Perfil />} />
        <Route path={ROUTES.CONSULTAR} element={<Consultar />} />
        <Route path={ROUTES.NOTIFICACAO} element={<Alertas />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
