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
import { Logger, LogLevel } from '@nestjs/common';
import * as _ from 'lodash';
import { Helpers } from './helpers.util';
import { InjectLoggerOptions } from './log.decorator';

// <editor-fold desc="TL;DR">
interface LogOptionsBase {
  /**
   * print notify message
   */
  notify?: false | LogLevel;
  /**
   * using custom notify message
   */
  notifyMessage?: string;
}

export interface LogCallingOptions extends LogOptionsBase {
  /**
   * print method parameters
   */
  parameters?: false | LogLevel;
}

export interface LogCalledOptions extends LogOptionsBase {
  /**
   * print method result when success
   */
  result?: false | LogLevel;
}

export interface LogThrowingOptions extends LogOptionsBase {
  /**
   * print error message
   */
  message?: false | LogLevel;
  /**
   * print error stack
   */
  stack?: false | LogLevel;
  /**
   * print error
   */
  raw?: false | LogLevel;
}

// tslint:disable-next-line:no-empty-interface
export interface LogCompletedOptions extends LogOptionsBase {}

export interface LogInvokeOptions extends InjectLoggerOptions {
  /**
   * before calling method
   */
  calling?: false | LogCallingOptions;
  /**
   * call method succeed
   */
  called?: false | LogCalledOptions;
  /**
   * method throwing an error
   */
  throwing?: false | LogThrowingOptions;
  /**
   * when method called, no matter it is success
   */
  completed?: false | LogCompletedOptions;
}

// </editor-fold>

export const LogInvokeDefaultOptions: LogInvokeOptions = {
  calling: { notify: 'log', parameters: false },
  called: false,
  throwing: { notify: 'log', message: 'warn', stack: false, raw: false },
  completed: false,
};

export function LogInvoke(options?: LogInvokeOptions);
export function LogInvoke(prefix?: string, options?: LogInvokeOptions);
export function LogInvoke(
  prefixOrOptions?: string | LogInvokeOptions,
  options: LogInvokeOptions = {},
): MethodDecorator {
  let prefix;
  if (_.isString(prefixOrOptions)) {
    prefix = prefixOrOptions;
  } else {
    prefix = Helpers.DEFAULT_PREFIX;
    options = prefixOrOptions || options;
  }

  options = _.defaultsDeep(options, LogInvokeDefaultOptions);

  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const className = Helpers.getClassName(target);
    const context = options.context || className;
    const logger = new Logger(`${prefix}:${context}`, {
      timestamp: options.isTimeDiffEnabled,
    });
    const methodSign = `${className}#${propertyKey as any}`;
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const { calling, called, throwing, completed } = options;

      if (calling) {
        const { notify, notifyMessage, parameters } = calling;
        if (notify) {
          Helpers.logWithLevel(
            logger,
            notify,
          )(notifyMessage || `calling ${methodSign}`);
        }

        if (parameters) {
          Helpers.logWithLevel(logger, parameters)('parameters:');
          Helpers.logWithLevel(logger, parameters)(args);
        }
      }

      try {
        const calledResult = await method.apply(this, args);
        if (called) {
          const { result, notify, notifyMessage } = called;

          if (notify) {
            Helpers.logWithLevel(
              logger,
              notify,
            )(notifyMessage || `${methodSign} called`);
          }

          if (result) {
            Helpers.logWithLevel(logger, result)('result:');
            Helpers.logWithLevel(logger, result)(calledResult);
          }
        }
        return calledResult;
      } catch (e) {
        if (throwing) {
          const { message, stack, raw, notify, notifyMessage } = throwing;

          if (notify) {
            Helpers.logWithLevel(
              logger,
              notify,
            )(notifyMessage || `${methodSign} failed`);
          }

          if (e instanceof Error) {
            if (message) {
              Helpers.logWithLevel(logger, message)('error message:');
              Helpers.logWithLevel(logger, message)(e?.message);
            }

            if (stack) {
              Helpers.logWithLevel(logger, stack)('error stack:');
              Helpers.logWithLevel(logger, stack)(e?.stack);
            }
          }

          if (raw) {
            Helpers.logWithLevel(logger, raw)('error:');
            Helpers.logWithLevel(logger, raw)(e);
          }
        }
        throw e;
      } finally {
        if (completed) {
          const { notify, notifyMessage } = completed;

          if (notify) {
            Helpers.logWithLevel(
              logger,
              notify,
            )(notifyMessage || `call ${methodSign} completed`);
          }
        }
      }
    };

    return descriptor;
  };
}
