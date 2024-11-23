import { useEffect } from 'react';
import './App.css'
// import Index from './view/inputTest'
import Login from './view/login/Login'
import StripeBackEnd from './control/Stripe';
import Pricing from './view/stripePayment/Pricing';
// import Register from './view/login/Register'
// import ReadOnly from './view/readOnly/ReadOnly'

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
    // Cria a conexão com o backend para escutar os eventos via SSE
    StripeBackEnd()

    // Cleanup: fechar a conexão quando o componente for desmontado
  }, []);

  return (
    <>
      {/* <Index/>
      <ReadOnly/> */}
      <Login/>
      {/* <Register/> */}

      <Pricing/>
      
      {/* <stripe-pricing-table pricing-table-id="prctbl_1QNKD1KGFMYvItWTlRjIY8Sp"
      publishable-key="pk_test_51QMz5bKGFMYvItWTmZVZmvAuamI1DHtQ82UJ7XGVcmGi0MHdRvCjgO18Omf5CUrbxBICjHGw13TcJKN8GzvqxikW002bs1msL8">
      </stripe-pricing-table> */}

    </>
  )
}

export default App
