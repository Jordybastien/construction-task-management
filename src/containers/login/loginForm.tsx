import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLogin } from '@/hooks/useLogin';
import { useNavigate } from 'react-router';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t('PAGES.LOGIN.FORM.NAME.ERRORS.INVALID'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { mutate: login, isLoading } = useLogin({
    onSuccess: () => {
      navigate('/home');
    },
    onError: (error) => {
      setErrorMessage(error?.message || 'Unable to login');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setErrorMessage('');
    login({ name: values.name });
  };

  return (
    <div className="flex w-full flex-col gap-y-4 lg:gap-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{t('ERRORS.UNABLE_TO_PROCEED')}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 gap-y-4 py-4">
            <div>
              <div>
                <div className="grid w-full items-center gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="font-normal text-gray-500">
                          {t('PAGES.LOGIN.FORM.NAME.LABEL')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('PAGES.LOGIN.FORM.NAME.PLACEHOLDER')}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <Button type="submit" className="min-w-full" loading={isLoading}>
                {t('PAGES.LOGIN.FORM.SIGN_IN')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
