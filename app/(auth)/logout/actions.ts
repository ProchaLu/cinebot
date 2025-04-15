'use server';

import { cookies } from 'next/headers';
import { deleteSession } from '../../../database/sessions';

export async function logout() {
  const cookieStore = await cookies();

  const token = cookieStore.get('sessionToken');

  if (token) {
    await deleteSession(token.value);

    cookieStore.delete(token.name);
  }

  return;
}
