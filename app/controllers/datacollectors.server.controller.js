'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Datacollector = mongoose.model('Datacollector'),
	_ = require('lodash');

var myParser = require('excel-file-parser');
var multer  = require('multer');
var bodyParser     = require('body-parser');

/**
 * Create a Datacollector
 */
exports.create = function(req, res) {
	var datacollector = new Datacollector(req.body);
	datacollector.user = req.user;

	datacollector.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datacollector);
		}
	});
};

exports.upload = function(req, res) {

	var tabname = req.body.tabName;
	var metadataFields = {
		originalDocumentName: req.body.originalDocumentName,
		subjectCategory: req.body.subjectCategory,
		subject: req.body.subject,
		documentAuthor: req.body.documentAuthor,
		dateDocumentProduced: req.body.dateDocumentProduced,
		dateDocumentReceived: req.body.dateDocumentReceived,
		documentSubmitter: req.body.documentSubmitter,
		documentReviewer: req.body.documentReviewer,
		originalSource: req.body.originalSource,
		dataVersion:    req.body.dataVersion,
		dataFields: req.body.dataFields
	};

	myParser.excelFileParser(req.files.file.name, tabname, metadataFields);
	//if(done==true){
		console.log(req.files);
		res.end('File uploaded.');
	//}
};

/**
 * Show the current Datacollector
 */
exports.read = function(req, res) {
	res.jsonp(req.datacollector);
};

/**
 * Update a Datacollector
 */
exports.update = function(req, res) {
	var datacollector = req.datacollector ;

	datacollector = _.extend(datacollector , req.body);

	datacollector.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datacollector);
		}
	});
};

/**
 * Delete an Datacollector
 */
exports.delete = function(req, res) {
	var datacollector = req.datacollector ;

	datacollector.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datacollector);
		}
	});
};

/**
 * List of Datacollectors
 */
exports.list = function(req, res) { 
	Datacollector.find().sort('-created').populate('user', 'displayName').exec(function(err, datacollectors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datacollectors);
		}
	});
};

/**
 * Datacollector middleware
 */
exports.datacollectorByID = function(req, res, next, id) { 
	Datacollector.findById(id).populate('user', 'displayName').exec(function(err, datacollector) {
		if (err) return next(err);
		if (! datacollector) return next(new Error('Failed to load Datacollector ' + id));
		req.datacollector = datacollector ;
		next();
	});
};

/**
 * Datacollector authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.datacollector.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
