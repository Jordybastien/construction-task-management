import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            {t('PAGES.NOT_FOUND.TITLE')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('PAGES.NOT_FOUND.MESSAGE')}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('LAYOUTS.HEADER.NAVIGATION.PROJECTS')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;