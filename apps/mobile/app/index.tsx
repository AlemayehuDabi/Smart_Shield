import { Redirect } from 'expo-router';

import { hrefAuthLogin } from '@/src/features/auth/hrefs';
import { useAuth } from '@/src/features/auth/hooks/use-auth';

export default function Index() {
  const { token, hydrated } = useAuth();

  if (!hydrated) {
    return null;
  }

  if (token) {
    return <Redirect href="/(shell)" />;
  }

  return <Redirect href={hrefAuthLogin} />;
}
