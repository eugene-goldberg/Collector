'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
	requestUrl = require('url'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path');

var multer  = require('multer');
var myParser = require('excel-file-parser');

var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost/datamanager-03-test';

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.facebookAppId = config.facebook.clientID;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	app.use(multer({ dest: './uploads/',
		rename: function (fieldname, filename) {
			return filename+Date.now();
		},
		onFileUploadStart: function (file) {
			console.log(file.originalname + ' is starting ...');
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path);
			var fileName = file.name;
			var done=true;
		}
	}));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        })
    }));

    function translateToString(input){
        var result="";
        input.forEach(function(item){
            result = result.concat(',').concat(item.name);
        });
        return result.slice(1);
    }


	app.get('/mongodata', function(req, res){
		console.log('Request Successful');
		console.log('_parsedUrl.query:  ' + req._parsedUrl.query);

		var url_parts = requestUrl.parse(req.url, true);
		var query = url_parts.query;

		var dataVersion = req.query.dataVersion;

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				console.log('Connection established to', url);

				var collection = db.collection(query.collectionName);

				if(query.dataVersion && query.subject){
					collection.find({DataVersion: query.dataVersion,
						Subject: query.subject
					}).toArray(function(err, docs) {
						//console.log(docs);
						res.json(docs);
						assert.equal(null, err);
						db.close();
					});
				}

				if(query.dataVersion){
					collection.find({DataVersion: query.dataVersion
					}).toArray(function(err, docs) {
						//console.log(docs);
						res.json(docs);
						assert.equal(null, err);
						db.close();
					});
				}

				if(query.subject){
					collection.find({Subject: query.subject
					}).toArray(function(err, docs) {
						//console.log(docs);
						res.json(docs);
						assert.equal(null, err);
						db.close();
					});
				}
			}
		});
	});

    app.get('/opportunities', function(req,res){
        var url_parts = requestUrl.parse(req.url, true);
        var query = url_parts.query;
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                var collection = db.collection('DC_Facilities');

                var opportunityDetail = {};

                collection.find({CSCOpportunityID: query.opportunityId, Subject: "salesforce-power"},
                    function(err, docs) {
                        var opportunityDetail = {};
                    docs.forEach(function(doc){
                        for(var prop in doc){
                            console.log('opportunity prop name: ' + prop);
                            console.log('prop value is  : ' + doc[prop]);
                            if(prop === 'OpportunityNmae' || prop === 'AccountName'){
                                opportunityDetail.OpportunityName = doc['OpportunityName'];
                                opportunityDetail.AccountName = doc['AccountName'];

								opportunityDetail.FY16 = doc['FY16'];
								opportunityDetail.FY17 = doc['FY17'];
								opportunityDetail.FY18 = doc['FY18'];
								opportunityDetail.FY19 = doc['FY19'];
								opportunityDetail.FY20 = doc['FY20'];
								opportunityDetail.FY21 = doc['FY21'];
								opportunityDetail.FY22 = doc['FY22'];
								opportunityDetail.FY23 = doc['FY23'];
								opportunityDetail.FY24 = doc['FY24'];
								opportunityDetail.FY25 = doc['FY25'];
                                opportunityDetail.DCCountry = doc['DCCountry'];
                                opportunityDetail.DCSiteCode = doc['DCSiteCode'];
                                opportunityDetail.DCSKU = doc['DCSKU'];

                                res.json(opportunityDetail);
                                assert.equal(null, err);
                            }
                        }
                    });
                });
            }
        });
    });

	app.get('/opportunity_ids', function(req, res){
		console.log('opportunity_idsRequest Successful');
		console.log('_parsedUrl.query:  ' + req._parsedUrl.query);

		var url_parts = requestUrl.parse(req.url, true);
		var query = url_parts.query;

		var dataVersion = req.query.dataVersion;

        var user = req.user;

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
                var collection = db.collection('users');
                collection.find({}).toArray(function(err, docs) {
                    docs.forEach(function(user){
                        //console.log('user id:  ' + user._id.toString());
                        if(user._id.toString() === req.session.passport.user){
                            console.log('found our current user:  ' + user.username);

                            var collection = db.collection('DC_Facilities');

                            collection.distinct('CSCOpportunityID', {OpportunityOwner: user.username},
                                (function(err, docs) {
                                    //console.log(docs);
                                    var idList = [];
                                    docs.forEach(function(doc){
                                        idList.push({name: doc});
                                    });
                                    res.json(idList);
                                    assert.equal(null, err);
                                    db.close();
                                }));
                        }
                    });

                });
            }
		});
	});

	app.get('/environment', function(req, res){

		var env = process.env.NODE_ENV;

		console.log('OUR ENVIRONMENT IS:  ' + env);

		res.send({environment: env});
	});

	app.get('/collections_metadata', function(req, res){
		console.log('Request Successful');
		console.log('_parsedUrl.query:  ' + req._parsedUrl.query);

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				console.log('Connection established to', url);

				var collection = db.collection('collections_metadata');

				collection.find({collectionName: req._parsedUrl.query}).toArray(function(err, docs) {
					//console.log(docs);
					res.json(docs);
					assert.equal(null, err);
					db.close();
				});
			}
		});
	});

    app.get('/playcards_dc_list', function(req, res){
        console.log('_parsedUrl.query:  ' + req._parsedUrl.query);

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                var collection = db.collection('PlaycardsData');

                collection.find().toArray(function(err, docs) {
                    //console.log(docs);
                    res.json(docs);
                    assert.equal(null, err);
                    db.close();
                });
            }
        });
    });

	app.get('/playcards_data', function(req, res){
		console.log('_parsedUrl.query:  ' + req._parsedUrl.query);
        var dcName = req._parsedUrl.query.split("=");
		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				console.log('Connection established to', url);

				var collection = db.collection('PlaycardsData');

                var name = dcName[1].replace(/%20/g,' ');

				collection.find({DataCenterName:name}).toArray(function(err, docs) {
					//console.log(docs);
					res.json(docs);
					assert.equal(null, err);
					db.close();
				});
			}
		});
	});

	app.post('/salesforce_update', function(req, res){
		console.log('Salesforce update Request Received');
		console.log('request body:  ' + req.body);

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);
                console.log('req.body.kwRequired_2016}', req.body.kwRequired_2016);
                var collection = db.collection('DC_Facilities');
                collection.update(
                    {
                        Subject: "salesforce-power",
                        CSCOpportunityID:  req.body.opportunityId
                    },
                    {$set:
                    {FY16: req.body.kwRequired_2016,
                        FY17: req.body.kwRequired_2017,
                        FY18: req.body.kwRequired_2018,
                        FY19: req.body.kwRequired_2019,
                        FY20: req.body.kwRequired_2020,
                        FY21: req.body.kwRequired_2021,
                        FY22: req.body.kwRequired_2022,
                        FY23: req.body.kwRequired_2023,
                        FY24: req.body.kwRequired_2024,
                        FY25: req.body.kwRequired_2025,
                        DCCountry: req.body.dcCountry,
                        DCSiteCode: req.body.dcSiteCode,
                        DCSKU: req.body.dcSku
                    }
                    },
                    function(err, result){
                    if(err){
                        console.log('err:  ' + err);
                    }
                        else{
                        console.log('update result:  ' + result);
                        res.send(201);
                    }
                });
            }
        });
	});

	app.post('/playcard_update', function(req, res){
		console.log('Playcard update Request Received');
		console.log('request body:  ' + req.body);

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				console.log('Connection established to', url);
				console.log('req.body.kwRequired_2016}', req.body.kwRequired_2016);
				var collection = db.collection('PlaycardsData');
                var translatedValue = translateToString(req.body.StrategicNaturesOfDc);
                var p = translatedValue;

				collection.update(
					{
                        DataCenterName: req.body.DataCenterName
					},
					{$set:
					{
                        DataCenterName: translateToString(req.body.DataCenterName),
                        StrategicNaturesOfDc: translateToString(req.body.StrategicNaturesOfDc),
                        AnnualDirectLeaseCost: req.body.AnnualDirectLeaseCost,
                        DataCenterTypes: translateToString(req.body.DataCenterTypes),
                        TenancyTypes: translateToString(req.body.TenancyTypes),
                        NetworkNodeTypes: translateToString(req.body.NetworkNodeTypes),
                        KeyAccounts: req.body.KeyAccounts,
                        SqFtTotal: req.body.SqFtTotal,
                        SqFtRaised: req.body.SqFtRaised,
                        PctUtilization: req.body.PctUtilization,
                        DcTier: req.body.DcTier,
                        ContractTypes: translateToString(req.body.ContractTypes),
                        LeaseEnds: req.body.LeaseEnds,
                        KwLeasedUtilized: req.body.KwLeasedUtilized,


                        AnnualCost: req.body.AnnualCost,
                        KWL: req.body.$kWL,
                        Certifications: translateToString(req.body.Certifications),
                        DcManager: req.body.DcManager,
                        DcRegionalHead: req.body.DcRegeonalHead,
                        CscSecurityLead: req.body.CscSecurityLead,
                        ConsolidationStrategy: req.body.ConsolidationStrategy,
                        OverallStrategies: translateToString(req.body.OverallStrategies),
                        Region: translateToString(req.body.Region),
                        BuildDate: req.body.BuildDate,
                        Vendor: req.body.Vendor,
                        ValueOfUtilization: req.body.ValueOfUtilization,
                        DatacenterAddress: req.body.DatacenterAddress,

                        DcProvider: req.body.DcProvider,
                        DcProviderContact: req.body.DcProviderContact
					}
					},
                    {upsert: true},
					function(err, result){
						if(err){
							console.log('err:  ' + err);
						}
						else{
							console.log('update result:  ' + result);
                            res.send(201);
						}
					});
			}
		});
	});



	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	if (process.env.NODE_ENV === 'secure') {
		// Log SSL usage
		console.log('Securely using https protocol');

		// Load SSL key and certificate
		var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
		var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

		// Create HTTPS Server
		var httpsServer = https.createServer({
			key: privateKey,
			cert: certificate
		}, app);

		// Return HTTPS server instance
		return httpsServer;
	}

	// Return Express server instance
	return app;
};
