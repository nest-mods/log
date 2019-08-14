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
 * Created by Diluka on 2019-02-25.
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
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Log, LogInvoke, LogModule } from '../src';

@Injectable()
class DemoService {

  @Log('test') private logger: LoggerService;

  test1(p1: string) {
    this.logger.log(`print p1 ${p1}`);
  }

  test2() {
    this.logger.error(['test2 %s', 'OK'], new Error('test2') as any);
  }

  test3() {
    this.logger.warn({ test: 'OK' });
  }

  @LogInvoke('test', { afterLevel: 'info', showParams: true })
  test4(a: string, b: number) {
    this.logger.debug('test4');
  }

  @LogInvoke('test', { message: 'calling test5', printString: true, showReturns: true })
  test5() {
    this.logger.log({ data: 'ok' });
    return { test: 'ok' };
  }

  @LogInvoke('test', { message: 'log error' })
  async test6() {
    throw new Error('oops!');
  }
}

describe('日志测试', function() {

  let service: DemoService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LogModule],
      providers: [DemoService],
    }).compile();

    service = module.get(DemoService);
  });

  it('test1', function() {
    service.test1('test1');
  });

  it('test2', function() {
    service.test2();
  });

  it('test3', function() {
    service.test3();
  });

  it('test4', function() {
    service.test4('test', 123);
  });

  it('test5', function() {
    service.test5();
  });

  it('test6', function() {
    service.test6().catch(e => null);
  });
});
