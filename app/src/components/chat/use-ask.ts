import { __setMessage } from '@/components/chat/internal';
import { buildUrlParams } from '@/lib/request';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, useTransition } from 'react';

export function useAsk (onFinish?: () => void) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<number>();
  const engineRef = useRef<number>();
  const [transitioning, startTransition] = useTransition();

  const ask = useCallback((message: string, options?: {
    engine?: number;
    headers?: Record<string, string>;
  }) => {
    router.push(`/c/new?${buildUrlParams({ message, engine }).toString()}`);

    __setMessage(message);
  }, []);
  const disabled = loading || transitioning;

  return {
    ask,
    engine,
    setEngine: (engine: number | undefined) => {
      engineRef.current = engine;
      setEngine(engine);
    },
    loading: disabled,
  };
}

export type UseAskReturns = ReturnType<typeof useAsk>;