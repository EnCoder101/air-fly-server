import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): any {
    return { data : 'Backend is up'};
  }
}
