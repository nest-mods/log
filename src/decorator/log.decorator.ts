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

import { Logger } from '@nestjs/common';
import { getLogger } from '../util/winston.util';
import { Helpers } from '../util/helpers.util';

export interface InjectLoggerOptions {
  context?: string;
  /**
   * not implemented
   */
  isTimeDiffEnabled?: boolean;
}

export const Log: (options?: InjectLoggerOptions) => PropertyDecorator = (options = {}) => {
  return (target: object, propertyKey: string | symbol) => {
    const context = options.context || Helpers.getClassName(target);
    const isTimeDiffEnabled = options.isTimeDiffEnabled;
    target[propertyKey] = new Logger(context, isTimeDiffEnabled);
  };
};

/**
 * get original winston logger
 * @deprecated due to config issue
 */
export const Log2: () => PropertyDecorator = () => {
  Logger.error(`@Log2() is deprecated. Use @Log() for instead.`, (new Error().stack).split('\n')[2], 'LogModule');
  return (target: object, propertyKey: string | symbol) => {
    const context = Helpers.getClassName(target);
    target[propertyKey] = getLogger(context);
  };
};
