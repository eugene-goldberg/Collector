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

    var pdf = require('html-pdf');

    var swig  = require('swig');

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

    app.use(bodyParser.urlencoded(
        {extended: true, limit: '50mb'}
    ));

    app.use(bodyParser.json(
        {limit: '50mb'}
    ));

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

                var collection = db.collection('SalesforceData');

                var opportunityDetail = {};

                collection.find({CSCOpportunityID: query.opportunityId},
                    function(err, docs) {
                        var opportunityDetail = {};
                        docs.forEach(function(doc){
                            for(var prop in doc){
                                console.log('opportunity prop name: ' + prop);
                                console.log('prop value is  : ' + doc[prop]);
                                if(prop === 'OpportunityNmae' || prop === 'AccountName'){
                                    opportunityDetail.OpportunityName = doc['OpportunityName'];
                                    opportunityDetail.AccountName = doc['AccountName'];
                                    opportunityDetail.OpportunityOwner = doc['OpportunityOwner'];
                                    opportunityDetail.SolutionExecutiveName = doc['SolutionExecutiveName'];
                                    opportunityDetail.SolutionArchitectName = doc['SolutionArchitectName'];
                                    opportunityDetail.NoDcInTheDeal = doc['NoDcInTheDeal'];

                                    opportunityDetail.kwFY16 = doc['kwFY16'];
                                    opportunityDetail.kwFY17 = doc['kwFY17'];
                                    opportunityDetail.kwFY18 = doc['kwFY18'];
                                    opportunityDetail.kwFY19 = doc['kwFY19'];
                                    opportunityDetail.kwFY20 = doc['kwFY20'];
                                    opportunityDetail.kwFY21 = doc['kwFY21'];
                                    opportunityDetail.kwFY22 = doc['kwFY22'];
                                    opportunityDetail.kwFY23 = doc['kwFY23'];
                                    opportunityDetail.kwFY24 = doc['kwFY24'];
                                    opportunityDetail.kwFY25 = doc['kwFY25'];

                                    opportunityDetail.cbFY16 = doc['cbFY16'];
                                    opportunityDetail.cbFY17 = doc['cbFY17'];
                                    opportunityDetail.cbFY18 = doc['cbFY18'];
                                    opportunityDetail.cbFY19 = doc['cbFY19'];
                                    opportunityDetail.cbFY20 = doc['cbFY20'];
                                    opportunityDetail.cbFY21 = doc['cbFY21'];
                                    opportunityDetail.cbFY22 = doc['cbFY22'];
                                    opportunityDetail.cbFY23 = doc['cbFY23'];
                                    opportunityDetail.cbFY24 = doc['cbFY24'];
                                    opportunityDetail.cbFY25 = doc['cbFY25'];

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
                            var isAdmin = user.roles.indexOf('admin');

                            if(isAdmin > 0){
                                var collection = db.collection('SalesforceData');

                                collection.distinct('CSCOpportunityID', {ProbabilityPct: {$gt: 80}},
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
                            else {
                                var collection = db.collection('SalesforceData');

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

    app.get('/salesforce_dc_data', function(req, res){
        console.log('_parsedUrl.query:  ' + req._parsedUrl.query);
        var query = req._parsedUrl.query.split("&");
        var opportunityId = query[0].split("=")[1];
        var dcName = query[1].split("=")[1];
        var p = 0;
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                var collection = db.collection('SalesforceData');

                collection.find({CSCOpportunityID:opportunityId}).toArray(function(err, docs) {
                    if(dcName.indexOf('%20') !== -1){
                        dcName = dcName.replace(/%20/g,' ')
                    }
                    docs.forEach(function(doc){
                        if(doc.DataCenters){
                            if(doc.DataCenters.length > 0){
                                doc.DataCenters.forEach(function(dc){
                                    if(dc.DataCenterName === dcName){
                                        res.json(dc);
                                    }
                                });
                            }

                        }
                        else {
                            res.send("no-match");
                        }
                    });

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

    app.get('/salesforce_quote', function(req, res){
        console.log('_parsedUrl.query:  ' + req._parsedUrl.query);
        var file = fs.createReadStream('public/modules/datacollectors/' + req._parsedUrl.query.split('=')[1]);
        var stat = fs.statSync('public/modules/datacollectors/' + req._parsedUrl.query.split('=')[1]);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        file.pipe(res);
    });

    app.post('/salesforce_update', function(req, res){
        console.log('Salesforce DC update Request Received');
        console.log('request body:  ' + req.body);

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection('SalesforceData');
                var matchingRecords;

                collection.update(
                    {
                        CSCOpportunityID: req.body.opportunityId
                    },
                    {$set:
                    {
                        OpportunityName: req.body.opportunityName,
                        AccountName: req.body.accountName,
                        OpportunityOwner: req.body.opportunityOwner,
                        SolutionExecutiveName: req.body.solutionExecutiveName,
                        SolutionArchitectName: req.body.solutionArchitectName,
                        NoDcInTheDeal: req.body.noDcInTheDeal

                    }

                    },
                    {upsert:true},

                    function(err, result){
                        if(err){
                            console.log('err:  ' + err);
                        }
                        else{
                            console.log('update result:  ' + result);
                        }
                    });

                collection.find(
                    {
                        CSCOpportunityID:  req.body.opportunityId,
                        "DataCenters.DataCenterName": req.body.dcName
                    }
                ).toArray(function(err, docs) {
                        if(err){
                            console.log('err: ' + err);
                        }
                        //console.log(docs);
                        //res.json(docs);
                        assert.equal(null, err);
                        if(docs.length === 0){
                            var m = 0;
                            collection.update(
                                {
                                    CSCOpportunityID: req.body.opportunityId
                                },
                                {
                                    $addToSet:

                                    {
                                        DataCenters:
                                        {
                                            "DataCenterName": req.body.dcName,
                                            "DCCountry": req.body.dcCountry,
                                            "DCSiteCode": req.body.dcSiteCode,
                                            "DCSKU": req.body.dcSku,

                                            "kwFY16": req.body.kwRequired_2016,
                                            "kwFY17": req.body.kwRequired_2017,
                                            "kwFY18": req.body.kwRequired_2018,
                                            "kwFY19": req.body.kwRequired_2019,
                                            "kwFY20": req.body.kwRequired_2020,
                                            "kwFY21": req.body.kwRequired_2021,
                                            "kwFY22": req.body.kwRequired_2022,
                                            "kwFY23": req.body.kwRequired_2023,
                                            "kwFY24": req.body.kwRequired_2024,
                                            "kwFY25": req.body.kwRequired_2025,

                                            "cbFY16": req.body.cbRequired_2016,
                                            "cbFY17": req.body.cbRequired_2017,
                                            "cbFY18": req.body.cbRequired_2018,
                                            "cbFY19": req.body.cbRequired_2019,
                                            "cbFY20": req.body.cbRequired_2020,
                                            "cbFY21": req.body.cbRequired_2021,
                                            "cbFY22": req.body.cbRequired_2022,
                                            "cbFY23": req.body.cbRequired_2023,
                                            "cbFY24": req.body.cbRequired_2024,
                                            "cbFY25": req.body.cbRequired_2025,

                                            cloudCompute:   req.body.cloudCompute,
                                            bizCloudHc: req.body.bizCloudHc,
                                            bizCloud:   req.body.bizCloud,
                                            storageAsAService:  req.body.storageAsAService,
                                            mainframe:  req.body.mainframe,
                                            unixFarm:   req.body.unixFarm,
                                            windowsFarm: req.body.windowsFarm,
                                            as400:  req.body.as400,
                                            myWorkstyle: req.body.myWorkstyle,
                                            cyber:  req.body.cyber,
                                            serviceManagement: req.body.serviceManagement,
                                            lan:    req.body.lan,
                                            wan:    req.body.wan
                                        }
                                    }
                                },
                                function(err, result){
                                    if(err){
                                        console.log('err:  ' + err);
                                    }
                                    else{
                                        console.log('update result:  ' + result);
                                        var fileName = 'quote_' + Math.random() + '.pdf';
                                        var html = fs.readFileSync('public/modules/datacollectors/template.html', 'utf8');

                                        var tmpl = swig.compileFile('public/modules/datacollectors/template.html'),
                                            renderedHtml = tmpl({
                                                DcName: req.body.dcName,
                                                OpportunityId:  req.body.opportunityId,
                                                OpportunityName:  req.body.opportunityName,
                                                AccountName:    req.body.accountName,
                                                kWLeased2016: Math.round(((Number(req.body.kwRequired_2016) * 185) * 12)),
                                                kWLeased2017: Math.round(((Number(req.body.kwRequired_2017) * 185) * 12)),
                                                kWLeased2018: Math.round(((Number(req.body.kwRequired_2018) * 185) * 12)),
                                                kWLeased2019: Math.round(((Number(req.body.kwRequired_2019) * 185) * 12)),
                                                kWLeased2020: Math.round(((Number(req.body.kwRequired_2020) * 185) * 12)),
                                                kWLeased2021: Math.round(((Number(req.body.kwRequired_2021) * 185) * 12)),
                                                kWLeased2022: Math.round(((Number(req.body.kwRequired_2022) * 185) * 12)),
                                                kWLeased2023: Math.round(((Number(req.body.kwRequired_2023) * 185) * 12)),
                                                kWLeased2024: Math.round(((Number(req.body.kwRequired_2024) * 185) * 12)),
                                                kWLeased2025: Math.round(((Number(req.body.kwRequired_2025) * 185) * 12)),

                                                electricBudget2016: Math.round((((Number(req.body.kwRequired_2016) * 720) * 12) * 0.09)),
                                                electricBudget2017: Math.round((((Number(req.body.kwRequired_2017) * 720) * 12) * 0.09)),
                                                electricBudget2018: Math.round((((Number(req.body.kwRequired_2018) * 720) * 12) * 0.09)),
                                                electricBudget2019: Math.round((((Number(req.body.kwRequired_2019) * 720) * 12) * 0.09)),
                                                electricBudget2020: Math.round((((Number(req.body.kwRequired_2020) * 720) * 12) * 0.09)),
                                                electricBudget2021: Math.round((((Number(req.body.kwRequired_2021) * 720) * 12) * 0.09)),
                                                electricBudget2022: Math.round((((Number(req.body.kwRequired_2022) * 720) * 12) * 0.09)),
                                                electricBudget2023: Math.round((((Number(req.body.kwRequired_2023) * 720) * 12) * 0.09)),
                                                electricBudget2024: Math.round((((Number(req.body.kwRequired_2024) * 720) * 12) * 0.09)),
                                                electricBudget2025: Math.round((((Number(req.body.kwRequired_2025) * 720) * 12) * 0.09))
                                            });

                                        var options = { filename: 'public/modules/datacollectors/' + fileName, format: 'Letter' };
                                        pdf.create(renderedHtml, options).toFile(function(err, res) {
                                            if (err) return console.log(err);
                                            console.log(res);
                                        });
                                        res.send(201,fileName);
                                    }
                                });
                        }
                        else {
                            var p = 0;
                            collection.update(
                                {
                                    CSCOpportunityID:  req.body.opportunityId,
                                    "DataCenters.DataCenterName": req.body.dcName
                                },
                                {$set:
                                {
                                    "DataCenters.$.kwFY16": req.body.kwRequired_2016,
                                    "DataCenters.$.kwFY17": req.body.kwRequired_2017,
                                    "DataCenters.$.kwFY18": req.body.kwRequired_2018,
                                    "DataCenters.$.kwFY19": req.body.kwRequired_2019,
                                    "DataCenters.$.kwFY20": req.body.kwRequired_2020,
                                    "DataCenters.$.kwFY21": req.body.kwRequired_2021,
                                    "DataCenters.$.kwFY22": req.body.kwRequired_2022,
                                    "DataCenters.$.kwFY23": req.body.kwRequired_2023,
                                    "DataCenters.$.kwFY24": req.body.kwRequired_2024,
                                    "DataCenters.$.kwFY25": req.body.kwRequired_2025,

                                    "DataCenters.$.cbFY16": req.body.cbRequired_2016,
                                    "DataCenters.$.cbFY17": req.body.cbRequired_2017,
                                    "DataCenters.$.cbFY18": req.body.cbRequired_2018,
                                    "DataCenters.$.cbFY19": req.body.cbRequired_2019,
                                    "DataCenters.$.cbFY20": req.body.cbRequired_2020,
                                    "DataCenters.$.cbFY21": req.body.cbRequired_2021,
                                    "DataCenters.$.cbFY22": req.body.cbRequired_2022,
                                    "DataCenters.$.cbFY23": req.body.cbRequired_2023,
                                    "DataCenters.$.cbFY24": req.body.cbRequired_2024,
                                    "DataCenters.$.cbFY25": req.body.cbRequired_2025,

                                    "DataCenters.$.DCCountry": req.body.dcCountry,
                                    "DataCenters.$.DCSiteCode": req.body.dcSiteCode,
                                    "DataCenters.$.DCSKU": req.body.dcSku,

                                    "DataCenters.$.cloudCompute":   req.body.cloudCompute,
                                    "DataCenters.$.bizCloudHc": req.body.bizCloudHc,
                                    "DataCenters.$.bizCloud":   req.body.bizCloud,
                                    "DataCenters.$.storageAsAService":  req.body.storageAsAService,
                                    "DataCenters.$.mainframe":  req.body.mainframe,
                                    "DataCenters.$.unixFarm":   req.body.unixFarm,
                                    "DataCenters.$.windowsFarm": req.body.windowsFarm,
                                    "DataCenters.$.as400":  req.body.as400,
                                    "DataCenters.$.myWorkstyle": req.body.myWorkstyle,
                                    "DataCenters.$.cyber":  req.body.cyber,
                                    "DataCenters.$.serviceManagement": req.body.serviceManagement,
                                    "DataCenters.$.lan":    req.body.lan,
                                    "DataCenters.$.wan":    req.body.wan
                                }

                                },
                                {upsert:true},
                                function(err, result){
                                    if(err){
                                        console.log('err:  ' + err);
                                    }
                                    else{
                                        console.log('update result:  ' + result);

                                        var fileName = 'quote_' + Math.random() + '.pdf';
                                        var html = fs.readFileSync('public/modules/datacollectors/template.html', 'utf8');
                                        var tmpl = swig.compileFile('public/modules/datacollectors/template.html'),
                                            renderedHtml = tmpl({
                                                DcName: req.body.dcName,
                                                OpportunityId:  req.body.opportunityId,
                                                OpportunityName:  req.body.opportunityName,
                                                AccountName:    req.body.accountName,
                                                kWLeased2016: Math.round(((Number(req.body.kwRequired_2016) * 185) * 12)),
                                                kWLeased2017: Math.round(((Number(req.body.kwRequired_2017) * 185) * 12)),
                                                kWLeased2018: Math.round(((Number(req.body.kwRequired_2018) * 185) * 12)),
                                                kWLeased2019: Math.round(((Number(req.body.kwRequired_2019) * 185) * 12)),
                                                kWLeased2020: Math.round(((Number(req.body.kwRequired_2020) * 185) * 12)),
                                                kWLeased2021: Math.round(((Number(req.body.kwRequired_2021) * 185) * 12)),
                                                kWLeased2022: Math.round(((Number(req.body.kwRequired_2022) * 185) * 12)),
                                                kWLeased2023: Math.round(((Number(req.body.kwRequired_2023) * 185) * 12)),
                                                kWLeased2024: Math.round(((Number(req.body.kwRequired_2024) * 185) * 12)),
                                                kWLeased2025: Math.round(((Number(req.body.kwRequired_2025) * 185) * 12)),

                                                electricBudget2016: Math.round((((Number(req.body.kwRequired_2016) * 720) * 12) * 0.09)),
                                                electricBudget2017: Math.round((((Number(req.body.kwRequired_2017) * 720) * 12) * 0.09)),
                                                electricBudget2018: Math.round((((Number(req.body.kwRequired_2018) * 720) * 12) * 0.09)),
                                                electricBudget2019: Math.round((((Number(req.body.kwRequired_2019) * 720) * 12) * 0.09)),
                                                electricBudget2020: Math.round((((Number(req.body.kwRequired_2020) * 720) * 12) * 0.09)),
                                                electricBudget2021: Math.round((((Number(req.body.kwRequired_2021) * 720) * 12) * 0.09)),
                                                electricBudget2022: Math.round((((Number(req.body.kwRequired_2022) * 720) * 12) * 0.09)),
                                                electricBudget2023: Math.round((((Number(req.body.kwRequired_2023) * 720) * 12) * 0.09)),
                                                electricBudget2024: Math.round((((Number(req.body.kwRequired_2024) * 720) * 12) * 0.09)),
                                                electricBudget2025: Math.round((((Number(req.body.kwRequired_2025) * 720) * 12) * 0.09))
                                            });
                                        var options = { filename: 'public/modules/datacollectors/' + fileName, format: 'Letter' };
                                        pdf.create(renderedHtml, options).toFile(function(err, res) {
                                            if (err) return console.log(err);
                                            //console.log(res);
                                        });
                                        res.send(201,fileName);
                                    }
                                });
                        }
                        //db.close();
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
