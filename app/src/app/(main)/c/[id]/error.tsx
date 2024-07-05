'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const authReason = ['Access denied', 'Unauthorized'];

export default function ({ error }: { error: Error }) {
  const auth = useAuth();

  return (
    <div className="min-h-screen flex items-center flex-col justify-center xl:pr-side">
      <div className="p-8 rounded-2xl bg-accent border shadow-2xl">
        <h2 className="text-2xl text-muted-foreground font-bold">
          Failed to view chat
        </h2>
        <p className="text-lg text-muted-foreground mt-4">{error.message}</p>
        <div className="flex gap-2 items-center mt-8">
          {!auth.me && authReason.includes(error.message) && (
            <Button asChild disabled={auth.isLoading}>
              <Link href="/auth/login">
                Login to continue
              </Link>
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link href="/">
              Back to homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}