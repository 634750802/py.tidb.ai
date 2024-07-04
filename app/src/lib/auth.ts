import { getMe } from '@/api/users';
import { cache } from 'react';

export const auth = cache(() => getMe().catch(() => undefined));
