/*
 * Created by Diluka on 2019-08-14.
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
import { Injectable, Logger, LoggerService, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Log, LogModule } from '../src';
import { DebugLoggerService } from '../src/service/debug-logger.service';

DebugLoggerService.DEFAULT_PREFIX = 'a';
DebugLoggerService.DEFAULT_MISSING_PREFIX = 'b';

describe('多日志测试', () => {
  @Injectable()
  class Demo1Service {

    @Log('demo1', { context: 'D1' }) private logger: LoggerService;

    test() {
      this.logger.log('demo1');
    }
  }

  @Injectable()
  class Demo2Service {
    @Log({ context: 'D2' }) private logger: LoggerService;

    test() {
      this.logger.log('demo2');
    }
  }

  @Module({
    providers: [Demo1Service],
    exports: [Demo1Service],
  })
  class Demo1Module {
  }

  @Module({
    providers: [Demo2Service],
    exports: [Demo2Service],
  })
  class Demo2Module {
  }

  let service1: Demo1Service;
  let service2: Demo2Service;
  const logger = new Logger('nestjs');
  const logger2 = new Logger();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Demo1Module, Demo2Module, LogModule],
    }).compile();

    // module.useLogger(new Logger());

    service1 = module.get(Demo1Service);
    service2 = module.get(Demo2Service);
  });

  it('测试日志', async () => {
    service1.test();
    service2.test();
    logger.log('test');
    logger2.log('test2');
    Logger.log('test3');
  });
});
