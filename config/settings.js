var path = require('path');

var settings = {
	database : {
		protocol : "mysql",
		query : {
			pool : true
		},
		host : "127.0.0.1",
		database : "nodejs",
		user : "root",
		password : "wsda"
	},
	log : {
		
	}
};

module.exports = settings;
