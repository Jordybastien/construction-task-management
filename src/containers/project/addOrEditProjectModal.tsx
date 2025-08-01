import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCreateProject } from '@/hooks/projects/useCreateProject';
import { useUpdateProject } from '@/hooks/projects/useUpdateProject';
import { useCurrentUser } from '@/stores/auth.store';
import type { ProjectWithStats } from '@/database/schemas/project.schema';
import { ProjectStatus } from '@/database/schemas/base.schema';
import { toast } from 'sonner';

interface AddOrEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectWithStats | null;
}

const AddOrEditProjectModal: React.FC<AddOrEditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = useMemo(() => !!project, [project]);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t('PAGES.PROJECT.FORM.NAME.ERRORS.INVALID'),
    }),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: project?.status || ProjectStatus.PLANNING,
    },
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        name: project?.name,
        description: project?.description,
        status: project?.status || ProjectStatus.PLANNING,
      });
    }
  }, [isEditing, project]);

  const { mutate: createProject, isLoading: isCreating } = useCreateProject({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT.FORM.SUCCESS.CREATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const { mutate: updateProject, isLoading: isUpdating } = useUpdateProject({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT.FORM.SUCCESS.UPDATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      return;
    }

    setErrorMessage('');

    if (isEditing && project) {
      updateProject({
        projectId: project.id,
        updates: {
          name: values.name,
          description: values.description,
          status: values.status || ProjectStatus.PLANNING,
        },
      });
    } else {
      createProject({
        name: values.name,
        description: values.description,
        status: values.status || ProjectStatus.PLANNING,
        created_by: currentUser.id, // In a real world app backend would deduce this from token but we're doing it like this for now :)
      });
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setErrorMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('PAGES.PROJECT.MODAL.EDIT_TITLE')
              : t('PAGES.PROJECT.MODAL.CREATE_TITLE')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('PAGES.PROJECT.MODAL.EDIT_DESCRIPTION')
              : t('PAGES.PROJECT.MODAL.CREATE_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t('ERRORS.UNABLE_TO_PROCEED')}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-normal text-gray-500">
                    {t('PAGES.PROJECT.FORM.NAME.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('PAGES.PROJECT.FORM.NAME.PLACEHOLDER')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT.FORM.STATUS.LABEL')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'PAGES.PROJECT.FORM.STATUS.PLACEHOLDER'
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ProjectStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(
                            `ATTRIBUTES.PROJECT.STATUS_ENUM.${status.toUpperCase()}`
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT.FORM.DESCRIPTION.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'PAGES.PROJECT.FORM.DESCRIPTION.PLACEHOLDER'
                      )}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('HELPERS.ACTIONS.CANCEL')}
              </Button>
              <Button type="submit" loading={isLoading}>
                {isEditing
                  ? t('HELPERS.ACTIONS.UPDATE')
                  : t('HELPERS.ACTIONS.CREATE')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrEditProjectModal;
