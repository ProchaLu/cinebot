import 'server-only';
import postgres, { type Sql } from 'postgres';
import postgresConfig from '../ley.config';
import { setEnvironmentVariables } from '../util/config';

setEnvironmentVariables();

declare namespace globalThis {
  let postgresSqlClient: Sql;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  if (!('postgresSqlClient' in globalThis)) {
    globalThis.postgresSqlClient = postgres(postgresConfig);
  }

  return globalThis.postgresSqlClient;
}

export const sql = connectOneTimeToDatabase();
