'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Datacollector = mongoose.model('Datacollector'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, datacollector;

/**
 * Datacollector routes tests
 */
describe('Datacollector CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Datacollector
		user.save(function() {
			datacollector = {
				name: 'Datacollector Name'
			};

			done();
		});
	});

	it('should be able to save Datacollector instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datacollector
				agent.post('/datacollectors')
					.send(datacollector)
					.expect(200)
					.end(function(datacollectorSaveErr, datacollectorSaveRes) {
						// Handle Datacollector save error
						if (datacollectorSaveErr) done(datacollectorSaveErr);

						// Get a list of Datacollectors
						agent.get('/datacollectors')
							.end(function(datacollectorsGetErr, datacollectorsGetRes) {
								// Handle Datacollector save error
								if (datacollectorsGetErr) done(datacollectorsGetErr);

								// Get Datacollectors list
								var datacollectors = datacollectorsGetRes.body;

								// Set assertions
								(datacollectors[0].user._id).should.equal(userId);
								(datacollectors[0].name).should.match('Datacollector Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Datacollector instance if not logged in', function(done) {
		agent.post('/datacollectors')
			.send(datacollector)
			.expect(401)
			.end(function(datacollectorSaveErr, datacollectorSaveRes) {
				// Call the assertion callback
				done(datacollectorSaveErr);
			});
	});

	it('should not be able to save Datacollector instance if no name is provided', function(done) {
		// Invalidate name field
		datacollector.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datacollector
				agent.post('/datacollectors')
					.send(datacollector)
					.expect(400)
					.end(function(datacollectorSaveErr, datacollectorSaveRes) {
						// Set message assertion
						(datacollectorSaveRes.body.message).should.match('Please fill Datacollector name');
						
						// Handle Datacollector save error
						done(datacollectorSaveErr);
					});
			});
	});

	it('should be able to update Datacollector instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datacollector
				agent.post('/datacollectors')
					.send(datacollector)
					.expect(200)
					.end(function(datacollectorSaveErr, datacollectorSaveRes) {
						// Handle Datacollector save error
						if (datacollectorSaveErr) done(datacollectorSaveErr);

						// Update Datacollector name
						datacollector.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Datacollector
						agent.put('/datacollectors/' + datacollectorSaveRes.body._id)
							.send(datacollector)
							.expect(200)
							.end(function(datacollectorUpdateErr, datacollectorUpdateRes) {
								// Handle Datacollector update error
								if (datacollectorUpdateErr) done(datacollectorUpdateErr);

								// Set assertions
								(datacollectorUpdateRes.body._id).should.equal(datacollectorSaveRes.body._id);
								(datacollectorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Datacollectors if not signed in', function(done) {
		// Create new Datacollector model instance
		var datacollectorObj = new Datacollector(datacollector);

		// Save the Datacollector
		datacollectorObj.save(function() {
			// Request Datacollectors
			request(app).get('/datacollectors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Datacollector if not signed in', function(done) {
		// Create new Datacollector model instance
		var datacollectorObj = new Datacollector(datacollector);

		// Save the Datacollector
		datacollectorObj.save(function() {
			request(app).get('/datacollectors/' + datacollectorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', datacollector.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Datacollector instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datacollector
				agent.post('/datacollectors')
					.send(datacollector)
					.expect(200)
					.end(function(datacollectorSaveErr, datacollectorSaveRes) {
						// Handle Datacollector save error
						if (datacollectorSaveErr) done(datacollectorSaveErr);

						// Delete existing Datacollector
						agent.delete('/datacollectors/' + datacollectorSaveRes.body._id)
							.send(datacollector)
							.expect(200)
							.end(function(datacollectorDeleteErr, datacollectorDeleteRes) {
								// Handle Datacollector error error
								if (datacollectorDeleteErr) done(datacollectorDeleteErr);

								// Set assertions
								(datacollectorDeleteRes.body._id).should.equal(datacollectorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Datacollector instance if not signed in', function(done) {
		// Set Datacollector user 
		datacollector.user = user;

		// Create new Datacollector model instance
		var datacollectorObj = new Datacollector(datacollector);

		// Save the Datacollector
		datacollectorObj.save(function() {
			// Try deleting Datacollector
			request(app).delete('/datacollectors/' + datacollectorObj._id)
			.expect(401)
			.end(function(datacollectorDeleteErr, datacollectorDeleteRes) {
				// Set message assertion
				(datacollectorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Datacollector error error
				done(datacollectorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Datacollector.remove().exec();
		done();
	});
});