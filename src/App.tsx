import { BrowserRouter } from 'react-router';
import { useEffect } from 'react';
import AppRoutes from '@/router/routes';
import CookieConsent from '@/components/cookieConsent';
import { useInitializeFromStorage } from '@/stores/auth.store';
import databaseManager from '@/database/manager';

const App = () => {
  const initializeFromStorage = useInitializeFromStorage();

  useEffect(() => {
    initializeFromStorage();

    const handleBeforeUnload = () => {
      databaseManager.close();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [initializeFromStorage]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
