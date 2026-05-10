import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import AnimalCadastro from "./pages/AnimalCadastro/AnimalCadastro";
import Vacinacao from "./pages/Vacinacao/Vacinacao";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-animal" element={<AnimalCadastro />} />
        <Route path="/vacinacao" element={<Vacinacao />} />
      </Routes>
    </BrowserRouter>
  );
}
