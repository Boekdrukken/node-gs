const { spawn } = require('child_process');

const concat = arg => Buffer.concat(arg).toString();
const linux = require('./binaries/linux');

class GS {

  constructor() {
    this._options = [];
    this._execPath = 'gs';
    if(process.platform === 'linux') {
      this._execPath = linux;
    }
    this._input = null;
  }

  executablePath(execPath) {
    this._execPath = execPath;
    return this;
  }

  input(input) {
    this._input = input;
    return this;
  }

  output(output) {
    output = output || '-';
    this.option(`-sOutputFile=${output}`);
    if(output === '-') {
      return this.q();
    }
    return this;
  }

  option(option) {
    this._options.push(option);
    return this;
  }

  define(key, value) {
    let string = `${key}`;
    if(value !== undefined) {
      string = `${string}=${value}`;
    }
    return this.option(`-d${string}`);
  }

  batch() {
    return this.define('BATCH');
  }

  nopause() {
    return this.define('NOPAUSE');
  }

  diskfonts() {
    return this.define('DISKFONTS');
  }

  nobind() {
    return this.define('NOBIND');
  }

  nocache() {
    return this.define('NOCACHE');
  }

  nodisplay() {
    return this.define('NODISPLAY');
  }

  safer() {
    return this.define('SAFER');
  }

  page(first, last) {
    last = last || first;
    return this.define('FirstPage', first).define('LastPage', last);
  }

  textAlphaBits(bits=4) {
    return this.define('TextAlphaBits', bits);
  }

  graphicsAlphaBits(bits=4) {
    return this.define('GraphicsAlphaBits', bits);
  }

  alphaBits(bits=4) {
    return this.textAlphaBits(bits).graphicsAlphaBits(bits);
  }

  interpolate() {
    return this.define('DOINTERPOLATE');
  }

  resolution(resolution=300) {
    return this.option(`-r${resolution}`);
  }

  device(value) {
    value = value || 'txtwrite';
    return this.option(`-sDEVICE=${value}`);
  }

  q() {
    return this.option('-q');
  }

  p() {
    return this.option('-p');
  }

  papersize(value) {
    return this.option(`-sPAPERSIZE=${value}`);
  }

  res(x, y) {
    let value = `${x}`;
    if(y) {
      value = `${value}x${y}`;
    }
    return this.option(`-r${value}`);
  }

  exec() {
    let args = [ ...this._options, this._input ];
    let cmd = this._execPath;

    return new Promise((resolve, reject) => {
      let proc = spawn(cmd, args);

      let stdout = [];
      let stderr = [];

      proc.stdout.on('data', data => stdout.push(data));
      proc.stderr.on('data', data => stderr.push(data));

      proc.on('close', code => {
        let props = {
          code,
          cmd,
          args,
          stdout: concat(stdout),
          stderr: concat(stderr)
        };
        if(code === 0) {
          resolve(props);
        } else {
          reject(Object.assign(new Error(`Execution failed`), props));
        }
      });
    });
  }

}

module.exports = () => new GS();
