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
import { RoomType } from '@/database/schemas/base.schema';
import useCreateRoom from '@/hooks/rooms/useCreateRoom';
import useUpdateRoom from '@/hooks/rooms/useUpdateRoom';
import type { RoomWithStats } from '@/database/dtos/room.dto';
import { toast } from 'sonner';

interface AddOrEditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorPlanId?: string | null;
  room?: RoomWithStats | null;
}

const AddOrEditRoomModal: React.FC<AddOrEditRoomModalProps> = ({
  isOpen,
  onClose,
  floorPlanId,
  room,
}) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = useMemo(() => !!room, [room]);

  const formSchema = z.object({
    name: z.string().min(1, {
      message: t('PAGES.PROJECT_DETAILS.ROOM.FORM.NAME.ERRORS.REQUIRED'),
    }).max(100, {
      message: t('PAGES.PROJECT_DETAILS.ROOM.FORM.NAME.ERRORS.TOO_LONG'),
    }),
    room_type: z.nativeEnum(RoomType),
    area_sqm: z.number().min(0, {
      message: t('PAGES.PROJECT_DETAILS.ROOM.FORM.AREA.ERRORS.INVALID'),
    }).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      room_type: RoomType.OTHER,
      area_sqm: 0,
    },
  });

  useEffect(() => {
    if (isEditing && room) {
      form.reset({
        name: room.name,
        room_type: room.room_type,
        area_sqm: room.area_sqm || 0,
      });
    } else if (isOpen && !room) {
      form.reset({
        name: '',
        room_type: RoomType.OTHER,
        area_sqm: 0,
      });
    }
  }, [isEditing, room, isOpen, form]);

  const { mutate: createRoom, isLoading: isCreating } = useCreateRoom({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT_DETAILS.ROOM.FORM.SUCCESS.CREATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const { mutate: updateRoom, isLoading: isUpdating } = useUpdateRoom({
    onSuccess: () => {
      onClose();
      form.reset();
      setErrorMessage('');
      toast.success(t('PAGES.PROJECT_DETAILS.ROOM.FORM.SUCCESS.UPDATE_MESSAGE'));
    },
    onError: (error) => {
      setErrorMessage(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!floorPlanId) {
      return;
    }

    setErrorMessage('');

    if (isEditing && room) {
      updateRoom({
        roomId: room.id,
        floorPlanId: floorPlanId,
        updates: {
          name: values.name,
          room_type: values.room_type,
          area_sqm: values.area_sqm,
        },
      });
    } else {
      createRoom({
        name: values.name,
        floor_plan_id: floorPlanId,
        room_type: values.room_type,
        area_sqm: values.area_sqm,
        boundary_coordinates: JSON.stringify([
          [100, 100], [300, 100], [300, 200], [100, 200]
        ]), // Default rectangle coordinates
      });
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setErrorMessage('');
  };

  const roomTypeOptions = [
    { value: RoomType.KITCHEN, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.KITCHEN') },
    { value: RoomType.BEDROOM, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.BEDROOM') },
    { value: RoomType.BATHROOM, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.BATHROOM') },
    { value: RoomType.LIVING_ROOM, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.LIVING_ROOM') },
    { value: RoomType.OFFICE, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.OFFICE') },
    { value: RoomType.HALLWAY, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.HALLWAY') },
    { value: RoomType.STORAGE, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.STORAGE') },
    { value: RoomType.UTILITY, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.UTILITY') },
    { value: RoomType.OTHER, label: t('ATTRIBUTES.ROOM.TYPE_ENUM.OTHER') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('PAGES.PROJECT_DETAILS.ROOM.MODAL.EDIT_TITLE')
              : t('PAGES.PROJECT_DETAILS.ROOM.MODAL.CREATE_TITLE')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('PAGES.PROJECT_DETAILS.ROOM.MODAL.EDIT_DESCRIPTION')
              : t('PAGES.PROJECT_DETAILS.ROOM.MODAL.CREATE_DESCRIPTION')}
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
                    {t('PAGES.PROJECT_DETAILS.ROOM.FORM.NAME.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('PAGES.PROJECT_DETAILS.ROOM.FORM.NAME.PLACEHOLDER')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.ROOM.FORM.TYPE.LABEL')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('PAGES.PROJECT_DETAILS.ROOM.FORM.TYPE.PLACEHOLDER')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypeOptions.map((option) => (
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

            <FormField
              control={form.control}
              name="area_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-gray-500">
                    {t('PAGES.PROJECT_DETAILS.ROOM.FORM.AREA.LABEL')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('PAGES.PROJECT_DETAILS.ROOM.FORM.AREA.PLACEHOLDER')}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

export default AddOrEditRoomModal;