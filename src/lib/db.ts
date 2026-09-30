import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sqlInstance: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    return null;
  }

  if (!sqlInstance) {
    sqlInstance = neon(connectionString);
  }

  return sqlInstance;
}
