import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import {
  createUserInsecure,
  getUserInsecure,
} from '../../../../database/users';
import {
  type User,
  userSchema,
} from '../../../../migrations/00001-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';

export type RegisterResponseBody =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<RegisterResponseBody>> {
  const requestBody = await request.json();

  const result = userSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  const user = await getUserInsecure(result.data.username);

  if (user) {
    return NextResponse.json(
      {
        errors: [{ message: 'Username already taken' }],
      },
      {
        status: 400,
      },
    );
  }

  const passwordHash = await bcrypt.hash(result.data.password, 12);

  const newUser = await createUserInsecure(result.data.username, passwordHash);

  if (!newUser) {
    return NextResponse.json(
      {
        errors: [{ message: 'Registration failed' }],
      },
      {
        status: 400,
      },
    );
  }

  const token = crypto.randomBytes(100).toString('base64');

  const session = await createSessionInsecure(token, newUser.id);

  if (!session) {
    return NextResponse.json(
      {
        errors: [{ message: 'Session creation failed' }],
      },
      {
        status: 400,
      },
    );
  }

  (await cookies()).set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  return NextResponse.json({ user: newUser });
}
