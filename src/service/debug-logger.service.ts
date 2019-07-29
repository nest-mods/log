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
 * Created by Diluka on 2019-07-26.
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
import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import * as _ from 'lodash';
import * as DebugLogger from '../../libs/debug-logger.js';
import * as DebugTrace from '../../libs/debug-trace.js';
import { LOG_APP_NAME_KEY } from '../constants';
import { LevelType } from '../interfaces';

DebugLogger.inspectOptions.colors = true;

export enum Levels {
  TRACE = 'trace',
  DEBUG = 'debug',
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

@Injectable()
export class DebugLoggerService implements LoggerService {

  constructor(@Inject(LOG_APP_NAME_KEY) @Optional() private appName: string) {
    DebugTrace({ always: true });
  }

  debug(message: any, context?: string): any {
    this.logv('debug', message, context);
  }

  error(message: any, trace?: string, context?: string): any {
    if (_.isArray(message) && trace) {
      message.push(trace);
    } else if (trace) {
      message = [message, trace];
    }
    this.logv('error', message, context);
  }

  log(message: any, context?: string): any {
    this.logv('info', message, context);
  }

  verbose(message: any, context?: string): any {
    this.logv('trace', message, context);
  }

  warn(message: any, context?: string): any {
    this.logv('warn', message, context);
  }

  private logv(level: LevelType, entry: any | any[], context?: string) {
    const logger = DebugLogger(`${this.appName || 'app'}:${context}`)[level];
    if (_.isArray(entry)) {
      logger(...entry);
    } else {
      logger(entry);
    }
  }

}
