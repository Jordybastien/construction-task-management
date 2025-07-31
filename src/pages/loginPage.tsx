import LoginForm from '@/containers/login/loginForm';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <img src="/assets/icon.png" width={72} height={72} alt="Logo" />
      </div>
      <h1 className="mb-2 text-center text-2xl font-semibold">
        {t('PAGES.LOGIN.WELCOME_BACK')}
      </h1>
      <p className="text-muted-foreground mb-6 text-center">
        {t('PAGES.LOGIN.DESCRIPTION')}
      </p>
      <LoginForm />
    </div>
  );
};

export default Login;
