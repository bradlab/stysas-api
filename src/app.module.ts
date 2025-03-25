import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomValidationPipe } from 'adapter/pipe/custom-validator.pipe';
import { SeedsModule } from './_seeder/seeds.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from './manager';
import { AdherentModule } from './adherent';
import { EquipmentModule } from './equipment/equipment.module';
import { SalleModule } from 'salle/salle.module';
import { EntraineurModule } from 'entraineur/entraineur.module';
import { AbonnementModule } from 'abonnement/abonnement.module';
import { HoraireModule } from 'horaire/horaire.module';
import { StatisticModule } from 'statistic/statistic.module';

@Module({
  imports: [
    StaffModule,
    AdherentModule,
    SalleModule,
    EquipmentModule,
    HoraireModule,
    EntraineurModule,
    AbonnementModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class IAppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env', //.dev.env, .prod.env
      expandVariables: true,
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: `winston/error.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `winston/combine.log`,
          // level: 'combine',
        }),
        new winston.transports.File({
          filename: `winston/debug.log`,
          level: 'debug',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:${+(process.env.DB_PORT || 27017)}/${process.env.DB_NAME}`,
    ),
    IAppModule,
    SeedsModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 2 * 60 * 1000, // 2 minutes,
        limit: 50,
      },
      {
        name: 'medium',
        ttl: 5 * 60 * 1000, // 5 minutes,
        limit: 200,
      },
      {
        name: 'long',
        ttl: 60 * 60 * 1000, // 1 heure,
        limit: 2000,
      },
    ]),
  ],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: CustomValidationPipe },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
