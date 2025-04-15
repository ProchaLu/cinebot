import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionToken } from '../../../database/sessions';
import LoginForm from './LoginForm';

type Props = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage(props: Props) {
  const cookieStore = await cookies();

  const sessionTokenCookie = cookieStore.get('sessionToken');

  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  if (session) {
    redirect('/');
  }

  const { returnTo } = await props.searchParams;

  return <LoginForm returnTo={returnTo} />;
}
