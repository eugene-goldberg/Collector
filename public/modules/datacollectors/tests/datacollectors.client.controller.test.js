'use strict';

(function() {
	// Datacollectors Controller Spec
	describe('Datacollectors Controller Tests', function() {
		// Initialize global variables
		var DatacollectorsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Datacollectors controller.
			DatacollectorsController = $controller('DatacollectorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Datacollector object fetched from XHR', inject(function(Datacollectors) {
			// Create sample Datacollector using the Datacollectors service
			var sampleDatacollector = new Datacollectors({
				name: 'New Datacollector'
			});

			// Create a sample Datacollectors array that includes the new Datacollector
			var sampleDatacollectors = [sampleDatacollector];

			// Set GET response
			$httpBackend.expectGET('datacollectors').respond(sampleDatacollectors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datacollectors).toEqualData(sampleDatacollectors);
		}));

		it('$scope.findOne() should create an array with one Datacollector object fetched from XHR using a datacollectorId URL parameter', inject(function(Datacollectors) {
			// Define a sample Datacollector object
			var sampleDatacollector = new Datacollectors({
				name: 'New Datacollector'
			});

			// Set the URL parameter
			$stateParams.datacollectorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/datacollectors\/([0-9a-fA-F]{24})$/).respond(sampleDatacollector);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datacollector).toEqualData(sampleDatacollector);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Datacollectors) {
			// Create a sample Datacollector object
			var sampleDatacollectorPostData = new Datacollectors({
				name: 'New Datacollector'
			});

			// Create a sample Datacollector response
			var sampleDatacollectorResponse = new Datacollectors({
				_id: '525cf20451979dea2c000001',
				name: 'New Datacollector'
			});

			// Fixture mock form input values
			scope.name = 'New Datacollector';

			// Set POST response
			$httpBackend.expectPOST('datacollectors', sampleDatacollectorPostData).respond(sampleDatacollectorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Datacollector was created
			expect($location.path()).toBe('/datacollectors/' + sampleDatacollectorResponse._id);
		}));

		it('$scope.update() should update a valid Datacollector', inject(function(Datacollectors) {
			// Define a sample Datacollector put data
			var sampleDatacollectorPutData = new Datacollectors({
				_id: '525cf20451979dea2c000001',
				name: 'New Datacollector'
			});

			// Mock Datacollector in scope
			scope.datacollector = sampleDatacollectorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/datacollectors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/datacollectors/' + sampleDatacollectorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid datacollectorId and remove the Datacollector from the scope', inject(function(Datacollectors) {
			// Create new Datacollector object
			var sampleDatacollector = new Datacollectors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Datacollectors array and include the Datacollector
			scope.datacollectors = [sampleDatacollector];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/datacollectors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDatacollector);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.datacollectors.length).toBe(0);
		}));
	});
}());