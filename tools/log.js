/**
 * 日志记录
 */
var logger = require('tracer').dailyfile({
	root : '../logs/'
});

module.exports = logger;