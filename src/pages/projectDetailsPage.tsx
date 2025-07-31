import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const ProjectDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('PAGES.PROJECT_DETAILS.TITLE')} - {id}
      </h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('PAGES.PROJECT_DETAILS.PROJECT_INFORMATION')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('PAGES.PROJECT_DETAILS.DETAILS_ABOUT_PROJECT')} {id}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t('PAGES.PROJECT_DETAILS.PROJECT_NAME_LABEL')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {t('PAGES.PROJECT_DETAILS.SAMPLE_PROJECT')} {id}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t('PAGES.PROJECT_DETAILS.STATUS_LABEL')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {t('PAGES.PROJECT_DETAILS.IN_PROGRESS')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;