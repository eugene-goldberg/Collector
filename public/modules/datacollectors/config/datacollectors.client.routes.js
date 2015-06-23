'use strict';

//Setting up route
angular.module('datacollectors').config(['$stateProvider',
	function($stateProvider) {
		// Datacollectors state routing
		$stateProvider.
		state('listDatacollectors', {
			url: '/datacollectors',
				templateUrl: 'modules/datacollectors/views/show-datacollector.client.view.html'
		}).
			state('dcupdate', {
				url: '/dcupdate',
				templateUrl: 'modules/datacollectors/views/dcupdate.client.view.html'
			}).
			state('playcard', {
				url: '/playcard',
				templateUrl: 'modules/datacollectors/views/playcard.client.view.html'
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
