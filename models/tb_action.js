module.exports = function(orm, models, db) {
	models.tb_action = db.define('tb_action', {
		id : {
			type : 'serial',
			key : true
		},
		name : {
			type : "text"
		},
		relinkaction :{
			type : "text"
		},
		username :{
			type : "text"
		},
		bucketid : {
			type : "integer"
		},
		userid : {
			type : 'integer'
		},
		type : {
			type : 'integer'
		},
		result : {
			type : 'text'
		}
	});
	models.tb_action.settings.set("pagination.perpage", 10);
};
