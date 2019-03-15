/*
 * MIT License
 *
 * Copyright (c) 2019 nest-mods
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Global, Logger, Module } from '@nestjs/common';
import { WinstonLoggerService } from './service/winston-logger.service';

@Global()
@Module({
  providers: [{
    provide: WinstonLoggerService,
    useFactory: () => WinstonLoggerService.getInstance(),
  }],
  exports: [WinstonLoggerService],
})
export class LogModule {
  constructor(private logger: WinstonLoggerService) {
    Logger.overrideLogger(this.logger);
  }
}

interface WinstonLoggerMessage {
  message?: string;
  level?: string;

  [key: string]: any;

  [key: number]: any;
}

declare module '@nestjs/common' {
  export interface LoggerService {
    log(message: any | WinstonLoggerMessage, context?: string): any;

    error(message: any | WinstonLoggerMessage, trace?: string, context?: string): any;

    warn(message: any | WinstonLoggerMessage, context?: string): any;
  }
}
