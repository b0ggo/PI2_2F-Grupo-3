```jsx
import React from 'react';
import './Perfil.css';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaComments,
  FaChevronRight,
} from 'react-icons/fa';

const Perfil = () => {
  return (
    <div className="perfil-container">
      {/* Header */}
      <div className="perfil-header">
        <div className="perfil-avatar">
          <FaUser />
        </div>

        <h2>{/* Nome do usuário */}</h2>
        <p>{/* Email do usuário */}</p>
      </div>

      {/* Tipo de Conta */}
      <div className="tipo-conta">
        <span>Tipo de Conta:</span>
        <div className="badge">Produtor Rural</div>
      </div>

      {/* Informações */}
      <div className="card-info">
        <h3>Informações Pessoais</h3>

        <div className="info-item">
          <FaEnvelope className="icon" />
          <div>
            <span>Email</span>
            <input type="email" placeholder="Digite seu email" />
          </div>
        </div>

        <div className="linha"></div>

        <div className="info-item">
          <FaPhone className="icon" />
          <div>
            <span>Telefone</span>
            <input type="text" placeholder="Digite seu telefone" />
          </div>
        </div>

        <div className="linha"></div>

        <div className="info-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <span>Localização</span>
            <input type="text" placeholder="Digite sua localização" />
          </div>
        </div>

        <div className="linha"></div>

        <div className="info-item">
          <FaUser className="icon" />
          <div>
            <span>CPF/CNPJ</span>
            <input type="text" placeholder="Digite seu CPF ou CNPJ" />
          </div>
        </div>
      </div>

      {/* Opções */}
      <div className="menu-card">
        <div className="menu-item">
          <div className="menu-left">
            <FaUser />
            <span>Editar Perfil</span>
          </div>
          <FaChevronRight />
        </div>

        <div className="menu-item">
          <div className="menu-left">
            <FaEnvelope />
            <span>Notificações por Email</span>
          </div>
          <FaChevronRight />
        </div>

        <div className="menu-item">
          <div className="menu-left">
            <FaPhone />
            <span>Alterar Telefone</span>
          </div>
          <FaChevronRight />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="estatisticas">
        <h3>Estatísticas</h3>

        <div className="stats-grid">
          <div className="stat-card verde">
            <h2>245</h2>
            <p>Animais</p>
          </div>

          <div className="stat-card azul">
            <h2>12</h2>
            <p>Lotes</p>
          </div>

          <div className="stat-card roxo">
            <h2>156</h2>
            <p>Vacinas</p>
          </div>
        </div>
      </div>

      {/* Botão sair */}
      <button className="btn-sair">
        <FaSignOutAlt />
        Sair da Conta
      </button>

      {/* Navbar */}
      <div className="bottom-nav">
        <div className="nav-item">
          <FaHome />
          <span>Início</span>
        </div>

        <div className="nav-item">
          <FaSearch />
          <span>Buscar</span>
        </div>

        <div className="nav-item">
          <FaBell />
          <span>Alertas</span>
        </div>

        <div className="nav-item">
          <FaComments />
          <span>Chat</span>
        </div>

        <div className="nav-item active">
          <FaUser />
          <span>Perfil</span>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
```

