'use strict';

//Datacollectors service used to communicate Datacollectors REST endpoints
angular.module('datacollectors').factory('Datacollectors', ['$resource',
	function($resource) {
		return $resource('datacollectors/:datacollectorId', { datacollectorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);