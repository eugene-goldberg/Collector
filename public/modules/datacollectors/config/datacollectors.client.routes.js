'use strict';

//Setting up route
angular.module('datacollectors').config(['$stateProvider',
	function($stateProvider) {
		// Datacollectors state routing
		$stateProvider.
		state('listDatacollectors', {
			url: '/sfupdate',
				templateUrl: 'modules/datacollectors/views/salesforce-update.client.view.html'
		}).
			state('internal-demand', {
				url: '/internal-demand',
				templateUrl: 'modules/datacollectors/views/internal-dc-demand.client.view.html'
			}).
			state('dcupdate', {
				url: '/dcupdate',
				templateUrl: 'modules/datacollectors/views/dcupdate.client.view.html'
			}).
			state('playcard', {
				url: '/playcard',
				templateUrl: 'modules/datacollectors/views/playcard.client.view.html'
			}).
			state('dashboard', {
				url: '/dashboard',
				templateUrl: 'modules/datacollectors/views/dashboard.client.view.html'
			}).
		state('createDatacollector', {
			url: '/datacollectors/create',
			templateUrl: 'modules/datacollectors/views/create-datacollector.client.view.html'
		}).
		state('viewDatacollector', {
			url: '/datacollectors/:datacollectorId',
			templateUrl: 'modules/datacollectors/views/view-datacollector.client.view.html'
		}).
		state('editDatacollector', {
			url: '/datacollectors/:datacollectorId/edit',
			templateUrl: 'modules/datacollectors/views/edit-datacollector.client.view.html'
		});
	}
]);
