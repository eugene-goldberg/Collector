'use strict';

// Datacollectors controller
angular.module('datacollectors').controller('DatacollectorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Datacollectors',
	function($scope, $stateParams, $location, Authentication, Datacollectors) {
		$scope.authentication = Authentication;

		// Create new Datacollector
		$scope.create = function() {
			// Create new Datacollector object
			var datacollector = new Datacollectors ({
				name: this.name
			});

			// Redirect after save
			datacollector.$save(function(response) {
				$location.path('datacollectors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Datacollector
		$scope.remove = function(datacollector) {
			if ( datacollector ) { 
				datacollector.$remove();

				for (var i in $scope.datacollectors) {
					if ($scope.datacollectors [i] === datacollector) {
						$scope.datacollectors.splice(i, 1);
					}
				}
			} else {
				$scope.datacollector.$remove(function() {
					$location.path('datacollectors');
				});
			}
		};

		// Update existing Datacollector
		$scope.update = function() {
			var datacollector = $scope.datacollector;

			datacollector.$update(function() {
				$location.path('datacollectors/' + datacollector._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Datacollectors
		$scope.find = function() {
			$scope.datacollectors = Datacollectors.query();
		};

		// Find existing Datacollector
		$scope.findOne = function() {
			$scope.datacollector = Datacollectors.get({ 
				datacollectorId: $stateParams.datacollectorId
			});
		};
	}
]);