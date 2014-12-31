/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var tools = require('../tools/tools');

var _ = require('lodash');
var logger = require('../tools/log');

var http = require('http');

// 去直接访问型添加界面
router.get('/addSimpleApi', tools.authorize, function(req, res) {
	return res.render('addSimpleApi', {
		title : 'addSimpleApi',
		error : req.flash('error'),
		user : req.session.user
	});
});
// 执行直接访问型添加
router.post('/addSimple', tools.authorize, function(req, res, next) {
	var params = _.pick(req.body, 'name', 'result');
	params.type = 1;
	params.userid = req.session.user.id;
	params.username = req.session.user.username;
	req.models.tb_action.exists({
		name : params.name,
		userid : req.session.user.id
	}, function(err, exists) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/action/addSimpleApi');
		}
		if (exists) {
			req.flash('error', '名称已经存在');
			return res.redirect('/action/addSimpleApi');
		}
		req.models.tb_action.create(params, function(err, item) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/action/addSimpleApi');
			}
			return res.redirect('/home');
		});
	});
});
// 去直接访问型/动态跳转型编辑界面
router.get('/editSimpleApi/:id', tools.authorize, function(req, res) {
	var id = req.params.id;
	req.models.tb_action.get(id, function(err, item) {
		if (!item || item.userid != req.session.user.id) {
			return res.redirect('/404');
		}

		var file = 'editSimpleApi';
		if (item.type == 2) {
			file = 'editReLinkApi';
		}
		return res.render(file, {
			title : file,
			item : item,
			error : req.flash('error'),
			user : req.session.user
		});
	});
});
// 执行直接访问型更新
router.post('/editSimple', tools.authorize, function(req, res, next) {
	var params = _.pick(req.body, 'id', 'name', 'result');
	var furl = '/action/editSimpleApi/' + params.id;
	req.models.tb_action.exists({
		name : params.name,
		userid : req.session.user.id
	}, function(err, exists) {
		if (err) {
			req.flash('error', err);
			return res.redirect(furl);
		}
		req.models.tb_action.get(params.id, function(err, item) {
			if (err) {
				req.flash('error', err);
				return res.redirect(furl);
			}
			if (!item) {
				return res.redirect('/404');
			}
			item.name = params.name;
			item.result = params.result;

			item.save(function(err) {
				if(err) {
					req.flash('error', err);
					return res.redirect(furl);
				}else {
					return res.redirect('/home');
				}
			});

		});
	});
});

// 去动态跳转型添加界面
router.get('/addReLinkApi', tools.authorize, function(req, res) {
	return res.render('addReLinkApi', {
		title : 'addReLinkApi',
		error : req.flash('error'),
		user : req.session.user
	});
});
// 执行动态跳转型添加
router.post('/addReLink', tools.authorize, function(req, res, next) {
	var params = _.pick(req.body, 'name', 'result', 'relinkaction');
	params.type = 2;
	params.userid = req.session.user.id;
	params.username = req.session.user.username;
	req.models.tb_action.exists({
		name : params.name,
		userid : req.session.user.id
	}, function(err, exists) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/action/addReLinkApi');
		}
		if (exists) {
			req.flash('error', '请求名称已经存在');
			return res.redirect('/action/addReLinkApi');
		}
		req.models.tb_action.create(params, function(err, item) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/action/addReLinkApi');
			}
			return res.redirect('/home');
		});
	});
});
// 执行动态跳转型更新
router.post('/editRelink', tools.authorize, function(req, res, next) {
	var params = _.pick(req.body, 'id', 'name', 'result', 'relinkaction');
	var furl = '/action/editSimpleApi/' + params.id;
	req.models.tb_action.exists({
		name : params.name,
		userid : req.session.user.id
	}, function(err, exists) {
		if (err) {
			req.flash('error', err);
			return res.redirect(furl);
		}
		req.models.tb_action.get(params.id, function(err, item) {
			if (err) {
				req.flash('error', err);
				return res.redirect(furl);
			}
			if (!item) {
				return res.redirect('/404');
			}

			item.name = params.name;
			item.result = params.result;

			item.save(function(err) {
				if(err) {
					req.flash('error', err);
					return res.redirect(furl);
				}else {
					return res.redirect('/home');
				}
			});
		});
	});
});

// 测试访问接口
router.get('/:username/:actionname', function(req, res, next) {
	req.models.tb_action.find({
		name : req.params.actionname,
		username : req.params.username
	}, function(err, items) {
		if (err) {
			return next(err);
		}
		if (items.length == 0) {
			return res.jsonp({
				error : "无法识别的接口"
			});
		}
		var action = items[0];
		if (action.type == 1) {
			simpleApi(res, action);
		} else if (action.type == 2) {
			relinkApi(res, action);
		}
	});
});

function simpleApi(res, action) {
	try {
		res.jsonp(JSON.parse(tools.parseHtmlEnteties(action.result)));
	} catch (e) {
		res.writeHead(200, {'Content-Type': 'text/html'});  
		res.write(action.result);
		res.end();
	}
}


function relinkApi(res, action) {
	http.get(action.relinkaction, function(res2) {
		var byte = '';
		res2.on('data', function(chunk) {
			byte += chunk;
		});
		res2.on('end', function() {
			var obj = JSON.parse(byte);
			var map = JSON.parse(action.result);
			if (obj.code || obj.code == 0) {
				// 包含data字段
				var data = obj.data;
				if (tools.isJsonObj(data)) {
					// data 字段是对象
					for ( var k in map) {
						obj.data[k] = map[k];
					}
				} else {
					// data 字段是数组
					for ( var i in data) {
						for ( var k in map) {
							data[i][k] = map[k];
						}
					}
				}
			}
			res.jsonp(obj);
		});
	});
}

// 删除接口
router.get('/del', tools.authorize, function(req, res, next) {
	var userid = req.session.user.id;
	var actionid = req.param('id');
	req.models.tb_action.find({
		id : actionid,
		userid : userid
	}).remove(function(err) {

	});
	return res.redirect('/home');
});

module.exports = router;