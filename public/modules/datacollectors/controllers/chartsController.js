'use strict';

// Datacollectors controller
angular.module('datacollectors').controller('chartsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors) {
        $scope.authentication = Authentication;

        function getData() {
            $http({
                method: 'GET',
                url: '/mongodata'
            }).success(function(data){
                // With the data succesfully returned, call our callback
                $scope.data = data;
            }).error(function(){
                alert('error');
            });
        }

            $scope.chartOptions = {

                dataSource: [

                    {company: 'ExxonMobile', 2004: 12345, 2005: 23456, 2006: 45678},
                    {company: 'Google', 2004: 35245, 2005: 66735, 2006: 9945},
                    {company: 'Microsoft', 2004: 73564, 2005: 15234, 2006: 23678}
                ],

                series: [
                    {valueField: '2004', name: '2004', type: 'area'},
                    {valueField: '2005', name: '2005', type: 'area'},
                    {valueField: '2006', name: '2006', type: 'spline', color: 'violet'}

                ],

                commonSeriesSettings: {
                    argumentField: 'company',
                    area: {color: 'blue'}

                },

                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center'
                },
                title: 'My Chart'

            };
    }
]);

