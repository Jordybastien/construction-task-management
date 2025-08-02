import { useTranslation } from 'react-i18next';
import { GroupedTypography } from '@/components/typography';
import ProjectGrid from '@/containers/project/grid';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <GroupedTypography
        title={{
          text: t('PAGES.HOME.PROJECT_SELECTION.TITLE'),
          as: 'h2',
        }}
        subtext={{
          text: t('PAGES.HOME.PROJECT_SELECTION.DESCRIPTION'),
          as: 'p',
        }}
        className="space-y-2"
      />
      <ProjectGrid />
    </div>
  );
};

export default HomePage;
