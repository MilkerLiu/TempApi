var express = require('express');
var router = express.Router();
var _ = require('lodash');
var tools = require('../tools/tools');
// 默认登录
router.get('/', function(req, res) {
	if(req.session.user) {
		res.redirect('/home');
	} else {
		res.redirect('/login');
	}
});

// to 404
router.get('/404', function(req, res) {
	res.render('share/404');
});

router.get('/login', tools.remember, function(req, res) {
	if(req.session.user) {
		res.redirect('/home');
	} else {
		res.render('login', {
			title : 'login',
			error : req.flash('error')
		});
	}
});

router.get('/document', tools.authorize, function(req, res){
	res.render('document', {
		title : 'document',
		user : req.session.user
	});
});

router.get('/register', tools.remember, function(req, res) {
	if(req.session.user) {
		res.redirect('/home');
	} else {
		res.render('register', {
			title : 'register',
			error : req.flash('error')
		});
	}
});

// 首页
router.all('/home', tools.authorize, function(req, res, next) {
	var params = _.pick(req.body, 'currentPage');
	var currentPage = params.currentPage;
	if(!currentPage) {
		currentPage = 1;
	}
	var q = {};
	// 查询列表
	req.models.tb_action.pages(q, function (err, pages) {
        var page = tools.getPage(pages, currentPage, 'home');
        req.models.tb_action.page(q, page.currentPage).run(function(err, items) {
    		if(err) {
    			return next(err);
    		}
    		// 查询分页数据
    		res.render('home', {
    			title : 'home',
    			items : items,
    			page : page,
    			error : req.flash('error'),
    			user : req.session.user
    		});
    	});
    });
});

// 测试接口
router.get('/test/:file', function(req, res) {
	res.render('test/' + req.params.file, {
		title : req.params.file
	});
});

router.get('/share/result', function(req, res) {
	res.render('share/result', {
		title : 'Result'
	});
});

module.exports = router;
