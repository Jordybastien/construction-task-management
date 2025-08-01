import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import AppLoading from '@/components/appLoading';
import { isUserAuthenticated } from '@/stores/auth.store';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const AuthLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = isUserAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <AppLoading />;
  }

  return (
    <div className="min-h-full lg:grid lg:min-h-screen lg:grid-cols-5">
      <div className="col-span-2 mx-auto flex w-full max-w-lg flex-col justify-center p-8">
        <Outlet />
      </div>
      <div className="from-primary relative col-span-3 hidden w-full items-center justify-center overflow-hidden bg-gradient-to-br to-white lg:flex">
        <img
          src="/assets/img-1.png"
          className="absolute inset-0 h-full w-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" />
        <div className="absolute bottom-8 left-1/2 z-10 w-[90%] max-w-xl -translate-x-1/2 rounded-2xl border border-white/30 bg-white/20 p-6 text-center text-white shadow-xl backdrop-blur-md">
          <div className="mb-2 flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
          </div>
          <blockquote className="mb-4 text-lg italic">
            "{t('PAGES.LOGIN.TESTIMONIAL')}"
          </blockquote>
          <div>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm">Project Manager, XYZ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
