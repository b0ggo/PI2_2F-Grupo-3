import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Login from "./pages/Login/Login";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha";
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
import Alertas from "./pages/PaginaAlertas/Alertas";
import AlertaDetalhe from "./pages/PaginaAlertas/AlertaDetalhe";
import Cooperativa from "./pages/Cooperativa/Cooperativa";
import Produtor from "./pages/Cooperativa/Produtor/Produtor";
import ChatCooperativa from "./pages/ChatEmpresas/ChatCooperativa";
import { ROUTES } from "./constants/routes.js";
import { getPerfil, resolveUserMode } from "./services/perfil.js";

function Protegido({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  useEffect(() => {
    let mounted = true;
    getPerfil().then((p) => {
      if (!mounted) return;
      const modo = resolveUserMode(p);
      try {
        sessionStorage.setItem('bottomNavMode', modo);
      } catch (e) {}
    }).catch(() => {});
    return () => { mounted = false };
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ESQUECI_SENHA} element={<EsqueciSenha />} />
        <Route path={ROUTES.CADASTRO_PRODUTOR} element={<CadastroProdutor />} />
        <Route path={ROUTES.CADASTRO_EMPRESA} element={<CadastroEmpresa />} />
        <Route path={ROUTES.HOME} element={<Protegido><PaginaInicial /></Protegido>} />
        <Route path={ROUTES.CADASTRO_ANIMAL} element={<Protegido><CadastrarAnimal /></Protegido>} />
        <Route path={ROUTES.CADASTRO_LOTES} element={<Protegido><CadastrarLotes /></Protegido>} />
        <Route path={ROUTES.VACINACAO} element={<Protegido><Vacinacao /></Protegido>} />
        <Route path={ROUTES.CHAT} element={<Protegido><ChatEmpresas /></Protegido>} />
        <Route path={ROUTES.COOPERATIVA_CHAT} element={<Protegido><ChatCooperativa /></Protegido>} />
        <Route path={ROUTES.PERFIL} element={<Protegido><Perfil /></Protegido>} />
        <Route path={ROUTES.EDITAR_PERFIL} element={<Protegido><EditarPerfil /></Protegido>} />
        <Route path={ROUTES.CONSULTAR} element={<Protegido><Consultar /></Protegido>} />
        <Route path={ROUTES.COOPERATIVA} element={<Protegido><Cooperativa /></Protegido>} />
        <Route path="/produtor/:id" element={<Protegido><Produtor /></Protegido>} />
        <Route path={ROUTES.ALERTA} element={<Protegido><AlertaDetalhe /></Protegido>} />
        <Route path={ROUTES.NOTIFICACAO} element={<Protegido><Alertas /></Protegido>} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
