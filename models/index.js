var orm = require('orm');
var paging = require("orm-paging");
var settings = require('../config/settings');
var logger = require('tracer').console();

var connection = null;

exports.init = function(app) {
	app.use(orm.express(settings.database, {
		define : function(db, models) {
			connection = db;
			db.use(paging);
			logger.log('database init');
			require('./student')(orm, models, db);
			require('./tb_user')(orm, models, db);
			require('./tb_action')(orm, models, db);
			db.settings.set('instance.returnAllErrors', true);
		}
	}));
};

exports.conn = function() {
	return connection;
}