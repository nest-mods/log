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
 * Created by Diluka on 2018/6/20.
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
import { Logger, LoggerService } from '@nestjs/common';
import { LevelType } from '../interfaces';
import { Helpers } from '../util/helpers.util';
import { InjectLoggerOptions } from './log.decorator';

export interface LogInvokeOptions extends InjectLoggerOptions {
  /**
   * log message, default is method sign
   */
  message?: string;
  /**
   * log level for before invoking
   */
  beforeLevel?: LevelType;
  /**
   * log level for after invoked
   */
  afterLevel?: LevelType;
  /**
   * stringify args & results
   */
  printString?: boolean;
  /**
   * print params
   */
  showParams?: boolean;
  /**
   * print stack line
   * @deprecated not work
   */
  showStackLine?: boolean;
  /**
   * print returns
   */
  showReturns?: boolean;
}

function logWithLevel(logger: LoggerService, level: string) {
  return (level in logger ? logger[level] : logger.log).bind(logger);
}

export function LogInvoke(options: LogInvokeOptions = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const className = Helpers.getClassName(target);
    const context = options.context || className;
    const logger = new Logger(context);
    const methodSign = `${className}#${propertyKey as any}`;
    const method = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      logWithLevel(logger, options.beforeLevel || 'info')([
        options.message || `Invoking ${methodSign}`,
        options.showParams
          ? options.printString ? Helpers.stringify(args) : args
          : '',
      ]);
      try {
        let result = await method.apply(this, args);
        logWithLevel(logger, options.afterLevel || 'trace')([
          options.message || `Invoked ${methodSign}`,
          options.showReturns
            ? options.printString ? Helpers.stringify(result) : result
            : '',
        ]);
        return result;
      } catch (e) {
        logWithLevel(logger, options.afterLevel || 'trace')([
          options.message || `Invoke ${methodSign} failed`,
          e,
        ]);
        throw e;
      }
    };
    return descriptor;
  };
}
