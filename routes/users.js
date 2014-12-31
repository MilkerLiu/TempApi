var express = require('express');
var router = express.Router();
var _ = require('lodash');
var tools = require('../tools/tools');

// 用户登录
router.post('/login', function(req, res) {
	var params = _.pick(req.body, 'username', 'password', 'remember');
	req.models.tb_user.find({
		username : params.username,
		password : tools.md5(params.password),
	}, function(err, items) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if (items.length > 0) {
			// 登陆成功
			if(params.remember){
				res.cookie('islogin', items[0].username, { maxAge: 60000*60*24*7 });  
			}
			req.session.user = items[0];
			return res.redirect('/home');
		} else {
			req.flash('error', '用户名或密码错误');
			return res.redirect('/login');
		}
	});
});

// 用户注册
router.post('/register', function(req, res) {
	var params = _.pick(req.body, 'username', 'password');
	req.models.tb_user.exists({
		username : params.username
	}, function(err, isexit) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/register');
		}
		if (isexit) {
			req.flash('error', '用户名已存在');
			return res.redirect('/register');
		}
		params.password = tools.md5(params.password);
		req.models.tb_user.create(params, function(err, item) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/register');
			}
			// 登陆成功
			req.session.user = item;
			return res.redirect('/home');
		});
	});
});

// 推出登陆
router.get('/logoff', function(req, res) {
	res.cookie('islogin', req.session.user.username, { maxAge:0 });  
	req.session.user = null;
	return res.redirect('/login');
});

module.exports = router;
