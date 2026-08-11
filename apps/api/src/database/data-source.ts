import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * Standalone DataSource for the TypeORM CLI only (migration:generate /
 * migration:run / migration:revert — see package.json scripts). The
 * running app never imports this file; it gets its connection through
 * DatabaseModule instead, which reads config via Nest's ConfigService.
 *
 * The CLI runs outside of Nest's DI, so config is loaded directly from
 * .env via `dotenv/config`, and entities/migrations are pointed at the
 * .ts sources so `migration:generate` can run without a build step.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
