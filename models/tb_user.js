module.exports = function(orm, models, db) {
	models.tb_user = db.define('tb_user', {
		id : {
			type : 'serial',
			key : true
		},
		username : {
			type : "text",
			size : 20,
			required : true
		},
		password : {
			type : "text",
			size : 50,
			required : true
		},
		isadmin : {
			type : 'boolean',
			required : true
		}
	});
};
