/**
 * New node file
 */
var crypto = require('crypto');

exports.authorize = function(req, res, next) {
	if (!req.session.user) {
		res.redirect('/login');
	} else {
		next();
	}
};

exports.remember = function(req, res, next) {
	if (req.session.user) {
		res.redirect('/home');
	} else {
		var islogin = req.cookies.islogin;
		console.log('cookies:' + islogin);
		if (islogin) {
			req.models.tb_user.find({
				username : islogin
			}, function(err, items) {
				if (err) {
					return next();
				}
				if (items.length > 0) {
					req.session.user = items[0];
					return res.redirect('/home');
				} else {
					return next();
				}
			});
		} else {
			next();
		}
	}
};

exports.md5 = function(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
};

exports.getPage = function(pages, currentPage, action) {
	if (!currentPage || currentPage < 1)
		currentPage = 1;
	if (currentPage > pages)
		currentPage = pages;
	var prePage = currentPage - 1;
	if (prePage < 1)
		prePage = 1;
	var nextPage = currentPage + 1;
	if (nextPage > pages)
		nextPage = pages;
	var page = {
		pages : pages,
		currentPage : currentPage,
		action : action,
		prePage : prePage,
		nextPage : nextPage,
	};
	return page;
};

// 判断是json
exports.isJson = function(obj) {
	var isjson = typeof (obj) == "object"
			&& (Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
				|| Object.prototype.toString.call(obj).toLowerCase() == "[object array]");
	return isjson;
};

// 判断是json对象
exports.isJsonObj = function(obj) {
	var isjson = typeof (obj) == "object"
			&& Object.prototype.toString.call(obj).toLowerCase() == "[object object]";
	return isjson;
}

exports.parseHtmlEnteties = function(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); 
        return String.fromCharCode(num);
    });
}