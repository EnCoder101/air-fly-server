import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './db/supabase.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private supabaseService: SupabaseService) {}

  @Get()
  getHello(): string {
    return this.appService.getHealthCheck();
  }
}
