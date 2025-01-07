import { useRouter } from 'next/router';

export function useRoleRedirect() {
  const router = useRouter();

  function redirectUser(role: string | undefined) {
    if (role === 'client') {
      router.push('/client');
    } else if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'developer') {
      router.push('/developer');
    } else {
      router.push('/');
    }
  }

  return { redirectUser };
}
