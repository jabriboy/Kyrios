import { useEffect } from 'react';
import './App.css'
import Home from './view/WEB1/Main/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './view/WEB1/Authentication/Login';
import NotFound from './view/WEB1/NotFound/NotFound';
import SignUp from './view/WEB1/Authentication/SignUp';
import CadastroEmpresa from './view/WEB1/CadastroEmpresa/CadastroEmpresa';
import Planos from './view/WEB1/Planos/Planos';

import StripeBackEnd from './control/Stripe';
import Configuracoes from './view/WEB1/Configuracoes/Configuracoes';
import Ajuda from './view/WEB1/Ajuda/Ajuda';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function App() {
  useEffect(() => {
    // LEMBRAR DE REMOVER O COMENTÁRIO 
    StripeBackEnd() 

  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cadastroEmpresa" element={<CadastroEmpresa />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/configurações" element={<Configuracoes />} />
          <Route path="/ajuda" element={<Ajuda />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
