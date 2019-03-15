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
import { Test } from '@nestjs/testing';
import { Injectable, LoggerService } from '@nestjs/common';
import { Log, LogModule } from '../src';
import * as winston from 'winston';

@Injectable()
class DemoService {

  @Log() private logger: LoggerService;

  test1(p1: string) {
    this.logger.log(`print p1 ${p1}`);
  }

  test2() {
    this.logger.log({
      message: 'test2',
      level: 'error',
    });
  }

  test3() {
    this.logger.warn('test3');
  }

  test4() {
    this.logger.log({
      message: 'test4',
      level: 'debug',
    });
  }

  test5() {
    this.logger.log({ data: 'ok' });
  }
}

class TestTransport extends winston.transports.Console {
  constructor() {
    super({
      level: 'silly',
    });
  }

  log(info: any, next: () => void): any {
    super.log(info, next);
    expect(info).toHaveProperty('label');
    if (done) {
      done();
    }
  }
}

let done;

describe('日志测试', function() {

  let service: DemoService;

  beforeAll(async () => {
    winston.loggers.options.transports = [new TestTransport()];
    const module = await Test.createTestingModule({
      imports: [LogModule],
      providers: [DemoService],
    }).compile();

    service = module.get(DemoService);
  });

  beforeEach(() => done = null);

  it('test1', function(d) {
    done = d;
    service.test1('test1');
  });

  it('test2', function(d) {
    done = d;
    service.test2();
  });

  it('test3', function(d) {
    done = d;
    service.test3();
  });

  it('test4', function(d) {
    done = d;
    service.test4();
  });

  it('test5', function(d) {
    done = d;
    service.test5();
  });
});
