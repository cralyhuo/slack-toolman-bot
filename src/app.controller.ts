import { Controller, Get, Res, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';

@Controller()
export class AppController {

  private logger = new Logger('App');

  constructor(private readonly appService: AppService) {}

  @Get()
  getBase(@Res() res) {
    this.logger.log(__dirname);
    res.sendFile(path.join(__dirname, 'index.html'), { root: path.resolve(__dirname + '/public') });
  }
}
