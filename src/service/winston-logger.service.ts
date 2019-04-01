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

/*
 * Created by Diluka on 2019-02-15.
 *
 *
 * ----------- 神 兽 佑 我 -----------
 *        ┏┓      ┏┓+ +
 *       ┏┛┻━━━━━━┛┻┓ + +
 *       ┃          ┃
 *       ┣     ━    ┃ ++ + + +
 *      ████━████   ┃+
 *       ┃          ┃ +
 *       ┃  ┴       ┃
 *       ┃          ┃ + +
 *       ┗━┓      ┏━┛  Code is far away from bug
 *         ┃      ┃       with the animal protecting
 *         ┃      ┃ + + + +
 *         ┃      ┃
 *         ┃      ┃ +
 *         ┃      ┃      +  +
 *         ┃      ┃    +
 *         ┃      ┗━━━┓ + +
 *         ┃          ┣┓
 *         ┃          ┏┛
 *         ┗┓┓┏━━━━┳┓┏┛ + + + +
 *          ┃┫┫    ┃┫┫
 *          ┗┻┛    ┗┻┛+ + + +
 * ----------- 永 无 BUG ------------
 */
import { Injectable, LoggerService } from '@nestjs/common';
import * as _ from 'lodash';
import { getLogger } from '../util/winston.util';
import { LogModuleOptions, WinstonLoggerMessage } from '../interfaces';
import { Helpers } from '../util/helpers.util';
import { LogEntry } from 'winston';
import checkLevelFilter = Helpers.checkLevelFilter;

const defaultOptions: Partial<LogModuleOptions> = {
  msLevel: ['info', 'warn', 'error'],
  stackLineLevel: 'silly',
  metaLevel: 'debug',
};

@Injectable()
export class WinstonLoggerService implements LoggerService {

  private static instance: LoggerService;

  private constructor(private options: LogModuleOptions) {
  }

  static getInstance(options?: LogModuleOptions) {
    if (!this.instance) {
      this.instance = new WinstonLoggerService(_.defaults(options, defaultOptions));
    }
    return this.instance;
  }

  error(message: any | WinstonLoggerMessage, trace?: string, context?: string) {
    const entry = {
      level: 'error',
      ...this.processMessage(message),
      trace,
    };
    this.logv(entry, context);
  }

  log(message: any | WinstonLoggerMessage, context?: string) {
    const entry = {
      level: 'info',
      ...this.processMessage(message),
    };
    this.logv(entry, context);
  }

  warn(message: any | WinstonLoggerMessage, context?: string) {
    const entry = {
      level: 'warn',
      ...this.processMessage(message),
    };
    this.logv(entry, context);
  }

  private logv(entry: WinstonLoggerMessage, context?: string) {
    this.applyFeatures(entry);
    getLogger(context).log(entry as LogEntry);
  }

  private processMessage(message: any): any {
    return _.isObject(message) ? message : { message };
  }

  private applyFeatures(entry: WinstonLoggerMessage) {
    entry.showMs = entry.showMs || checkLevelFilter(this.options.msLevel, entry.level);
    entry.showStackLine = entry.showStackLine || checkLevelFilter(this.options.stackLineLevel, entry.level);
    entry.showMeta = entry.showMeta || checkLevelFilter(this.options.metaLevel, entry.level);
  }
}
