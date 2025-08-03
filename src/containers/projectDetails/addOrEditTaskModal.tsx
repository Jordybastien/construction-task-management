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
import useCreateTask from '@/hooks/tasks/useCreateTask';
import useUpdateTask from '@/hooks/tasks/useUpdateTask';
import { useCurrentUser } from '@/stores/auth.store';
import { useSelectedFloorPlan } from '@/stores/floorPlan.store';
import useFetchRoomsByFloorPlan from '@/hooks/rooms/useFetchByFloorPlan';
import type { TaskWithDetails } from '@/database/dtos/task.dto';
import { TaskStatus } from '@/database/schemas/base.schema';
import { toast } from 'sonner';

interface AddOrEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskWithDetails | null;
  addPresetStatus?: TaskStatus;
  addPresetCoordinates?: { lat: number; lng: number };
}

const AddOrEditTaskModal: React.FC<AddOrEditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  addPresetStatus,
  addPresetCoordinates,
}) => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const selectedFloorPlan = useSelectedFloorPlan();
  const { rooms } = useFetchRoomsByFloorPlan(selectedFloorPlan?.id);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = useMemo(() => !!task, [task]);

  const formSchema = z.object({
    title: z.string().min(2, {
      message: t('PAGES.PROJECT_DETAILS.TASK.FORM.TITLE.ERRORS.INVALID'),
    }),
    description: z.string().optional(),
    room_id: z.string().min(1, {
      message: t('PAGES.PROJECT_DETAILS.TASK.FORM.ROOM.ERRORS.REQUIRED'),
    }),
    status: z.nativeEnum(TaskStatus).optional(),
    position_lat: z.number().optional(),
    position_lng: z.number().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      room_id: '',
      status: addPresetStatus || TaskStatus.NOT_STARTED,
      position_lat: addPresetCoordinates?.lat || 50,
      position_lng: addPresetCoordinates?.lng || 50,
    },
  });

  useEffect(() => {
    if (isEditing && task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        room_id: task.room_id || '',
        status: task.status,
        position_lat: task.position_lat,
        position_lng: task.position_lng,
      });
    }

    if (!isEditing && (addPresetStatus || addPresetCoordinates)) {
      form.reset({
        title: '',
        description: '',
        room_id: '',
        status: addPresetStatus || TaskStatus.NOT_STARTED,
        position_lat: addPresetCoordinates?.lat || 50,
        position_lng: addPresetCoordinates?.lng || 50,
      });
    }
  }, [isEditing, task, addPresetStatus, addPresetCoordinates, form]);

  const { mutate: createTask, isLoading: isCreating } = useCreateTask({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(
        t('PAGES.PROJECT_DETAILS.TASK.FORM.SUCCESS.CREATE_MESSAGE') ||
          'Task created successfully!'
      );
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const { mutate: updateTask, isLoading: isUpdating } = useUpdateTask({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(
        t('PAGES.PROJECT_DETAILS.TASK.FORM.SUCCESS.UPDATE_MESSAGE') ||
          'Task updated successfully!'
      );
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

    if (isEditing && task) {
      updateTask({
        taskId: task.id,
        updates: {
          title: values.title,
          description: values.description,
          room_id: values.room_id as string,
          status: values.status,
          position_lat: values.position_lat,
          position_lng: values.position_lng,
        },
      });
    } else {
      createTask({
        title: values.title,
        description: values.description,
        room_id: values.room_id as string,
        status: values.status || TaskStatus.NOT_STARTED,
        position_lat: Number(values.position_lat),
        position_lng: Number(values.position_lng),
        created_by: currentUser.id,
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
              ? t('PAGES.PROJECT_DETAILS.TASK.MODAL.EDIT_TITLE') || 'Edit Task'
              : t('PAGES.PROJECT_DETAILS.TASK.MODAL.CREATE_TITLE') ||
                'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('PAGES.PROJECT_DETAILS.TASK.MODAL.EDIT_DESCRIPTION') ||
                'Update the task details'
              : t('PAGES.PROJECT_DETAILS.TASK.MODAL.CREATE_DESCRIPTION') ||
                'Fill in the details to create a new task'}
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
                    {t('PAGES.PROJECT_DETAILS.TASK.FORM.TITLE.LABEL') ||
                      'Task Title'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t(
                          'PAGES.PROJECT_DETAILS.TASK.FORM.TITLE.PLACEHOLDER'
                        ) || 'Enter task title'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.TASK.FORM.ROOM.LABEL') || 'Room'}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'PAGES.PROJECT_DETAILS.TASK.FORM.ROOM.PLACEHOLDER'
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.TASK.FORM.STATUS.LABEL')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'PAGES.PROJECT_DETAILS.TASK.FORM.STATUS.PLACEHOLDER'
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(
                            `ATTRIBUTES.TASK.STATUS_ENUM.${status.toUpperCase()}`
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
                    {t('PAGES.PROJECT_DETAILS.TASK.FORM.DESCRIPTION.LABEL') ||
                      'Description'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        t(
                          'PAGES.PROJECT_DETAILS.TASK.FORM.DESCRIPTION.PLACEHOLDER'
                        ) || 'Enter task description (optional)'
                      }
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

export default AddOrEditTaskModal;
