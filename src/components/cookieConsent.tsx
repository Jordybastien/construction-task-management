import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { COOKIES_IDENTIFIERS } from '@/utils/constants';
import { getCookie, setCookie } from '@/utils/cookies';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = getCookie(COOKIES_IDENTIFIERS.COOKIE_CONSENT);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    setCookie(COOKIES_IDENTIFIERS.COOKIE_CONSENT, 'true', 365);
    setIsVisible(false);
  };

  const decline = () => {
    setCookie(COOKIES_IDENTIFIERS.COOKIE_CONSENT, 'false', 365);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-50 w-full p-4">
      <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-4 rounded-md bg-white p-4 shadow-xl ring-1 ring-gray-100 lg:grid-cols-6 lg:gap-2">
        <div className="col-span-4 flex flex-col items-center gap-4 lg:flex-row">
          <img src="/assets/cookie.svg" className="h-16 w-16" />
          <div className="w-full text-center lg:text-left">
            <span className="font-semibold text-gray-900">
              {t('COOKIE_CONSENT.TITLE')}
            </span>
            <p className="font-regular text-sm text-gray-600">
              {t('COOKIE_CONSENT.SUB_TEXT')}
            </p>
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-center gap-x-2">
          <Button variant="outline" onClick={decline}>
            {t('HELPERS.ACTIONS.DECLINE')}
          </Button>
          <Button variant="default" onClick={accept}>
            {t('HELPERS.ACTIONS.ACCEPT')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
