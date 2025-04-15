import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import { getUserWithPasswordHashInsecure } from '../../../../database/users';
import {
  type User,
  userSchema,
} from '../../../../migrations/00001-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';

export type LoginResponseBody =
  | {
      user: { username: User['username'] };
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<LoginResponseBody>> {
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

  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    result.data.username,
  );

  if (!userWithPasswordHash) {
    return NextResponse.json(
      {
        errors: [{ message: 'Username or Password is invalid' }],
      },
      {
        status: 400,
      },
    );
  }

  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        errors: [{ message: 'Username or Password is invalid' }],
      },
      {
        status: 400,
      },
    );
  }

  const token = crypto.randomBytes(100).toString('base64');

  const session = await createSessionInsecure(token, userWithPasswordHash.id);

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

  return NextResponse.json({
    user: {
      username: userWithPasswordHash.username,
    },
  });
}
