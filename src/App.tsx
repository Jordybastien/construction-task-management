import { BrowserRouter } from 'react-router';
import AppRoutes from '@/router/routes';
import CookieConsent from '@/components/cookieConsent';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
