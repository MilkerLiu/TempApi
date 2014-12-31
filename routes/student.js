var express = require('express');
var router = express.Router();
//
var _ = require('lodash');
var logger = require('tracer').console();
var db = require('../models/');
// 
router.get('/list', function(req, res) {
	req.models.student.find().all(function(err, students) {
		if (err)
			return next(err);
		res.send({
			items : students
		});
	});
});

router.get('/count', function(req, res) {
	req.models.student.count(function(err, count) {
		if (err)
			return next(err);
		res.send({
			count : count
		});
	});
});

router.get('/find', function(req, res) {
	console.log(req.models.student);
	req.models.student.find({
		name : 'Tom'
	}, 12, function(err, items) {
		if (err)
			return next(err);
		res.send({
			items : items
		});
	});
});

router.get('/query', function(req, res) {
	db.conn().driver.execQuery("SELECT id FROM student", function(err, data) {
		if (err)
			return next(err);
		res.send({
			items : data
		});
	});
});

module.exports = router;