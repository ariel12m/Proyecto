import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoResponse } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): Promise<NoResponse> {
    return this.appService.no();
  }
}
