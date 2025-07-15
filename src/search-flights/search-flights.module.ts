import { Module } from '@nestjs/common';
import { SearchFlightsController } from './search-flights.controller';
import { SearchFlightsService } from './search-flights.service';
import { SupabaseService } from 'src/db/supabase.service';

@Module({
  controllers: [SearchFlightsController],
  providers: [SearchFlightsService,SupabaseService]
})
export class SearchFlightsModule {}
