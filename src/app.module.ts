import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './db/supabase.service';
import { ConfigModule } from '@nestjs/config';
import { SearchFlightsModule } from './search-flights/search-flights.module';
import { BookFlightModule } from './book-flight/book-flight.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env', isGlobal: true }), SearchFlightsModule, BookFlightModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule { }
