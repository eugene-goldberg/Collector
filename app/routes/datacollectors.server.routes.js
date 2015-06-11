'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var datacollectors = require('../../app/controllers/datacollectors.server.controller');

	// Datacollectors Routes
	app.route('/datacollectors')
		.get(datacollectors.list)
		.post(users.requiresLogin, datacollectors.create);

	app.route('/api/files')
		.post(users.requiresLogin, datacollectors.upload);

	app.route('/datacollectors/:datacollectorId')
		.get(datacollectors.read)
		.put(users.requiresLogin, datacollectors.hasAuthorization, datacollectors.update)
		.delete(users.requiresLogin, datacollectors.hasAuthorization, datacollectors.delete);

	// Finish by binding the Datacollector middleware
	app.param('datacollectorId', datacollectors.datacollectorByID);
};
