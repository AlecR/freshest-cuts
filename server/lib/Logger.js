var moment = require('moment');

class Logger {
  constructor(prefix) {
    this.prefix = prefix
  }
}

const timestamp = () => {
  const timestamp = `[${moment().format('MM/DD HH:MM:ss')}]`;
  return timestamp
}

timestamp();

Logger.prototype.log = function(text) {
  console.log(`${timestamp()} ${this.prefix}  ${text}`);
}

Logger.prototype.warn = function(text) {
  console.log(`\x1b[33m%s\x1b[0m`, `${timestamp()} ${this.prefix}  ${text}`);
}

Logger.prototype.error = function(text) {
  console.log(`\x1b[31m%s\x1b[0m`, `${timestamp()} ${this.prefix}  ${text}`);
}

Logger.prototype.success = function(text) {
  console.log(`\x1b[32m%s\x1b[0m"`, `${timestamp()} ${this.prefix}  ${text}`);
}

module.exports = Logger;