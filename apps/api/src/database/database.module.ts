import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Registers the Postgres connection for the whole app, the same
 * `registerAsync`-style pattern AuthModule already uses for JwtModule:
 * secrets/config come from ConfigService, and a missing DATABASE_URL
 * kills the boot instead of connecting with `undefined`.
 *
 * `autoLoadEntities: true` picks up every entity registered via a
 * `TypeOrmModule.forFeature([...])` elsewhere (e.g. UsersModule), so
 * entities never need to be listed again here.
 *
 * `synchronize` is always false — schema changes go through migrations
 * (see src/database/migrations) so the schema stays versioned in git.
 * `migrationsRun: true` applies any pending migration on boot; the
 * TypeORM migrations table makes this idempotent, so it's safe to run
 * on every start. The glob covers both extensions because `nest start
 * --watch` runs migrations straight from the .ts sources, while the
 * built app (dist/) only has .js.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: [__dirname + '/migrations/*.{ts,js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}
