// Shared env for every e2e spec (both auth.e2e-spec.ts and the scaffold's
// app.e2e-spec.ts import AppModule, which now needs a real Postgres
// connection). Runs before any spec file, via jest-e2e.json's
// `setupFiles`. Values set here are picked up by ConfigModule.forRoot():
// Nest's dotenv loader never overwrites variables already present in
// process.env, so these win over anything in a local .env.
process.env.DATABASE_URL =
  'postgresql://code_connect:code_connect@localhost:5432/code_connect_test';
process.env.JWT_SECRET = 'e2e-test-secret';
process.env.JWT_EXPIRES_IN = '3600';
