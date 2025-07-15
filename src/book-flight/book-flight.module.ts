import { Module } from '@nestjs/common';
import { BookFlightController } from './book-flight.controller';
import { BookFlightService } from './book-flight.service';
import { SupabaseService } from 'src/db/supabase.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({

  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
        template: {
          dir: (__dirname + '/mail-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    })],
  controllers: [BookFlightController],
  providers: [BookFlightService, SupabaseService]
})
export class BookFlightModule { }
