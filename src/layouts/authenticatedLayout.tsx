import { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { setCookie } from '@/utils/cookies';
import { COOKIES_IDENTIFIERS } from '@/utils/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  FolderOpen,
  FileText,
} from 'lucide-react';
import CustomAvatar from '@/components/customAvatar';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import AppLoading from '@/components/appLoading';
import {
  isUserAuthenticated,
  useLogoutUser,
  useCurrentUser,
} from '@/stores/auth.store';

interface NavItem {
  to: string;
  label: string;
  translationKey?: string;
  icon: React.ComponentType<{ size?: number }>;
}

const AuthLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = isUserAuthenticated();
  const logoutUser = useLogoutUser();
  const currentUser = useCurrentUser();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setCookie(COOKIES_IDENTIFIERS.APP_LOCALE, language, 365);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AppLoading />;
  }

  const navItems: NavItem[] = [
    {
      to: '/home',
      label: 'Projects',
      translationKey: 'LAYOUTS.HEADER.NAVIGATION.PROJECTS',
      icon: FolderOpen,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: FileText,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Check if current route is project details to apply full width
  const isFullScreen = useMemo(
    () => location.pathname.includes('/project/'),
    [location]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              {/* TODO: Replace with logo */}
              <div className="flex flex-row items-center gap-x-4 border-r border-gray-100 pr-8">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    LOGO
                  </span>
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-sm font-semibold text-gray-900">
                    {t('LAYOUTS.HEADER.APP_TITLE')}
                  </h1>
                </div>
              </div>

              <nav className="hidden space-x-8 md:flex">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/5 text-primary'
                            : 'text-gray-600 hover:text-gray-900'
                        }`
                      }>
                      <IconComponent size={12} />
                      <span>
                        {item.translationKey
                          ? t(item.translationKey)
                          : item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2">
                    <span className="text-sm">
                      {t(`LOCALES.${i18n.language.toUpperCase()}`)}
                    </span>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    <span className="flex items-center space-x-2">
                      <span>{t('LOCALES.EN')}</span>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('de')}>
                    <span className="flex items-center space-x-2">
                      <span>{t('LOCALES.DE')}</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="!py-1 hover:bg-gray-50">
                    <CustomAvatar
                      name={currentUser?.name as string}
                      size="md"
                    />
                    <div className="hidden text-left sm:block">
                      <p className="max-w-[70px] truncate text-sm font-medium text-gray-900 lg:max-w-[110px]">
                        {currentUser?.name}
                      </p>
                      {/* <p className="max-w-[70px] truncate text-xs text-gray-500 lg:max-w-[110px]">
                        other user detail here
                      </p> */}
                    </div>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('LAYOUTS.HEADER.NAVIGATION.SETTINGS')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('LAYOUTS.HEADER.NAVIGATION.LOGOUT')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main
        className={twMerge(
          isFullScreen ? 'w-full' : 'mx-auto max-w-7xl py-6 px-4 lg:px-8'
        )}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
