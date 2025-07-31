import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreateProjectCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400">
      <CardContent className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('PAGES.HOME.CREATE_PROJECT.TITLE')}
            </h3>
            <p className="max-w-xs text-sm text-gray-600">
              {t('PAGES.HOME.CREATE_PROJECT.DESCRIPTION')}
            </p>
          </div>

          <Button className="mt-4">
            <Plus className="h-4 w-4" />
            {t('PAGES.HOME.ACTIONS.CREATE_PROJECT')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateProjectCard;
