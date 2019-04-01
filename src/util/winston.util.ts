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
import * as winston from 'winston';
import { format, transports } from 'winston';
import * as _ from 'lodash';
import { render } from 'prettyjson';
// import * as rootPath from 'app-root-path';
// import * as path from 'path';

const DEFAULT_LABEL = 'default';

export function getLogger(label = DEFAULT_LABEL) {

  if (_.isEmpty(winston.loggers.options.transports)) {
    winston.loggers.options.transports = [new transports.Console({ level: process.env.DEBUG_LEVEL || 'info' })];
  }

  if (!winston.loggers.has(label)) {
    winston.loggers.add(label, {
      format: format.combine(
        printStackTrace(),
        levelToUpper(),
        format.label({ label }),
        format.timestamp({ format: 'YYYY-MM-DD A h:mm:ss.SSS' }),
        format.ms(),
        format.colorize({ all: true }),
        format.errors({ stack: true }),
        printLog,
      ),
    });
  }

  return winston.loggers.get(label);
}

// <editor-fold desc="getStackInfo">
/**
 * inspired from tracer
 * @see https://github.com/baryon/tracer
 */
function getStackInfo() {

  const data: any = {};

  // get call stack, and analyze it
  const stack = new Error().stack;
  data.stack = stack;
  const stackList = stack.split('\n').slice(11);
  const endIndex = _.findIndex(stackList, s => s === '    at Generator.next (<anonymous>)');
  if (endIndex === -1) { // cannot find stack
    return data;
  }
  let index = endIndex - 1;
  while (!/node_modules/.test(stackList[index - 1])) {
    index--;
  }

  const s = stackList[index] || stackList[0];
  data.stackLine = /node_modules/.test(s) ? '' : s;

  // get all file,method and line number
  // const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  // const stackReg2 = /at\s+(.*):(\d*):(\d*)/i;
  // const rootDir = rootPath.path;
  // const sp = stackReg.exec(s) || stackReg2.exec(s);
  // if (sp && sp.length === 5) {
  //   data.method = sp[1];
  //   data.path = sp[2];
  //   data.line = sp[3];
  //   data.pos = sp[4];
  //   data.folder = path.dirname(rootDir && path.isAbsolute(rootDir)
  //     ? data.path.replace(new RegExp('^' + rootDir + path.sep + '?'), '')
  //     : path.resolve(data.path));
  //   data.file = path.basename(data.path);
  // }

  return data;
}

// </editor-fold>

const printStackTrace = format(info => {
  info.stackLine = '';

  if (winston.config.npm.levels[info.level] > winston.config.npm.levels.info) {
    const { /*line, pos, folder, file, path,*/ stack, stackLine } = getStackInfo();
    if (stackLine) {
      info.stackLine = '\n' + stackLine;
    } else {
      // info.stackLine = '\n' + stack;
    }
  }

  return info;
});

const levelToUpper = format(info => {
  info.level = info.level.toUpperCase();
  return info;
});

const printLog = format.printf(({
                                  level, message, label, timestamp,
                                  trace,
                                  showMs, ms,
                                  showStackLine, stackLine,
                                  showMeta, meta, ...otherMeta
                                }) => {
  let logString = `[${level}]\t${timestamp}\t[${label}]\t${message}`;
  if (showMs) {
    logString += ` ${ms}`;
  }
  if (showStackLine) {
    logString += stackLine;
  }
  let o: any = {};
  if (!_.isEmpty(trace)) {
    o.trace = trace;
  }
  if (showMeta) {
    o = _.assign(o, meta, otherMeta);
  }
  logString += _.isEmpty(o) ? '' : ('\n' + render(o));
  return logString;
});
