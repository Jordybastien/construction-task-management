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
import { TaskStatus } from '@/database/schemas/base.schema';
import useCreateChecklistItem from '@/hooks/checklist/useCreateChecklistItem';
import useUpdateChecklistItem from '@/hooks/checklist/useUpdateChecklistItem';
import type { ChecklistItem } from '@/database/dtos/task.dto';
import { toast } from 'sonner';

interface AddOrEditChecklistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string | null;
  checklistItem?: ChecklistItem | null;
}

const AddOrEditChecklistItemModal: React.FC<AddOrEditChecklistItemModalProps> = ({
  isOpen,
  onClose,
  taskId,
  checklistItem,
}) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = useMemo(() => !!checklistItem, [checklistItem]);

  const formSchema = z.object({
    title: z.string().min(1, {
      message: t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.TITLE.ERRORS.REQUIRED'),
    }).max(200, {
      message: t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.TITLE.ERRORS.TOO_LONG'),
    }),
    description: z.string().max(1000, {
      message: t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.DESCRIPTION.ERRORS.TOO_LONG'),
    }).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.NOT_STARTED,
    },
  });

  useEffect(() => {
    if (isEditing && checklistItem) {
      form.reset({
        title: checklistItem.title,
        description: checklistItem.description || '',
        status: checklistItem.status,
      });
    } else if (isOpen && !checklistItem) {
      form.reset({
        title: '',
        description: '',
        status: TaskStatus.NOT_STARTED,
      });
    }
  }, [isEditing, checklistItem, isOpen, form]);

  const { mutate: createChecklistItem, isLoading: isCreating } = useCreateChecklistItem({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.SUCCESS.CREATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const { mutate: updateChecklistItem, isLoading: isUpdating } = useUpdateChecklistItem({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.SUCCESS.UPDATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!taskId) {
      return;
    }

    setErrorMessage('');

    if (isEditing && checklistItem) {
      updateChecklistItem({
        checklistItemId: checklistItem.id,
        taskId,
        updates: {
          title: values.title,
          description: values.description,
          status: values.status || TaskStatus.NOT_STARTED,
        },
      });
    } else {
      createChecklistItem({
        task_id: taskId,
        title: values.title,
        description: values.description,
      });
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setErrorMessage('');
  };

  const statusOptions = [
    { value: TaskStatus.NOT_STARTED, label: t('ATTRIBUTES.TASK.STATUS_ENUM.NOT_STARTED') },
    { value: TaskStatus.IN_PROGRESS, label: t('ATTRIBUTES.TASK.STATUS_ENUM.IN_PROGRESS') },
    { value: TaskStatus.BLOCKED, label: t('ATTRIBUTES.TASK.STATUS_ENUM.BLOCKED') },
    { value: TaskStatus.FINAL_CHECK, label: t('ATTRIBUTES.TASK.STATUS_ENUM.FINAL_CHECK') },
    { value: TaskStatus.DONE, label: t('ATTRIBUTES.TASK.STATUS_ENUM.DONE') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('PAGES.PROJECT_DETAILS.CHECKLIST.MODAL.EDIT_TITLE')
              : t('PAGES.PROJECT_DETAILS.CHECKLIST.MODAL.CREATE_TITLE')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('PAGES.PROJECT_DETAILS.CHECKLIST.MODAL.EDIT_DESCRIPTION')
              : t('PAGES.PROJECT_DETAILS.CHECKLIST.MODAL.CREATE_DESCRIPTION')}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.TITLE.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.TITLE.PLACEHOLDER')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-gray-500">
                      {t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.STATUS.LABEL')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.STATUS.PLACEHOLDER')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.DESCRIPTION.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.DESCRIPTION.PLACEHOLDER')}
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

export default AddOrEditChecklistItemModal;