'use strict';

// Datacollectors controller
angular.module('datacollectors').controller('PlaycardController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors) {
        $scope.authentication = Authentication;

        $scope.playcard = {
            dcTier: "Tier-4",
            contractType: "5-year Lease",
            leaseEnds: "12/12/2015",
            kWlUtil:    "540/430",
            annualCost: "$3,5000.00",
            $kWl:   "0.359",
            certifications: "ISO9001, super-cert-01, other-cert-02",
            dcManager:  "Scott Margolin",
            dcSecurityLead: "Joe Smith",
            regionalHead:   "Tom Soyer",
            buildDate:  "12/12/2015",
            vendor: "ATT",
            valueOfUtilization: "42",
            dcAddress:  "123 Main st, Chicago IL 60604",
            dcProvider: "some provider",
            dcProviderContact:    "some contact",
            consolidationStrategyItem1:  "Optimize Footprint in Data Center in FY16 and FY17 ",
            consolidationStrategyItem2:  "and then go do something else... ",
            annualDirectLeaseCost:  "2,349.00",
            keyAccounts: ['Aon','Zurich']
        };




        $scope.dataVersionValues = [

        ];

        $scope.getData = function() {
            angular.forEach( $scope.outputCategories, function( value, key ) {
                collectionName = value.collectionName;
            });
            $http({
                method: 'GET',
                url: '/playcard_data'
                //,
                //skip: 10,
                //take:   10
            }).success(function(data){
                // With the data succesfully returned, call our callback
                $scope.data = data;
                var fields = data[0].DataFields;

                var fieldList = [];

                fieldList = fields.split(',');

                fieldList.forEach(function(field){
                    $scope.collectionDatafields.push({dataField: field, caption: field, visible: false});
                });
            }).error(function(){
                alert('error');
            });
        };
    }
]);

