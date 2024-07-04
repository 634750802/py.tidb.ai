'use client';

import { login } from '@/api/auth';
// import { supportedProviders } from '@/app/(main)/(admin)/settings/authentication/providers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/errors';
// import { fetcher } from '@/lib/fetch';
// import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function Signin ({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();

  const [error, setError] = useState<string>();

  const form = useForm<{ username: string; password: string }>();

  const handleSubmit = form.handleSubmit(async (data) => {
    setError(undefined);
    try {
      await login(data);
      router.replace(refineCallbackUrl(callbackUrl));
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  });

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Could not login with provided credentials.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel htmlFor="username">Username</FormLabel>
            <FormField
              name="username"
              render={({ field }) => (
                <Input placeholder="x@example.com" {...field} />
              )}
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormField
              name="password"
              render={({ field }) => (
                <Input type="password" {...field} />
              )}
            />
          </FormItem>
          <Button>Login</Button>
        </form>
      </Form>
    </>
  );
}

function refineCallbackUrl (url: string | undefined) {
  if (!url) {
    return `${location.origin}`;
  }
  if (/auth\/login/.test(url)) {
    return `${location.origin}`;
  } else {
    return url;
  }
}
