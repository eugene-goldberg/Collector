'use strict';

// Datacollectors controller
angular.module('datacollectors').controller('chartsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors) {
        $scope.authentication = Authentication;

        //function getData() {
        //    $http({
        //        method: 'GET',
        //        url: '/mongodata'
        //    }).success(function(data){
        //        // With the data succesfully returned, call our callback
        //        $scope.data = data;
        //    }).error(function(){
        //        alert('error');
        //    });
        //}

            $scope.chartOptions = {

                dataSource: [

                    {
                        timePeriod: "3 weeks ago",
                        totalRecords: 8112,
                        probabilityOver80: 671,
                        opportunitiesWithDatacenters: 124
                    }, {
                        timePeriod: "2 weeks ago",
                        totalRecords: 9156,
                        probabilityOver80: 896,
                        opportunitiesWithDatacenters: 756
                    }, {
                        timePeriod: "1 week ago",
                        totalRecords: 10243,
                        probabilityOver80: 945,
                        opportunitiesWithDatacenters: 954
                    }, {
                        timePeriod: "current week",
                        totalRecords: 12117,
                        probabilityOver80: 1012,
                        opportunitiesWithDatacenters: 1278
                    }
                ],

                commonSeriesSettings: {
                    argumentField: "timePeriod",
                    type: "bar",
                    hoverMode: "allArgumentPoints",
                    selectionMode: "allArgumentPoints",
                    label: {
                        visible: true,
                        format: "fixedPoint",
                        precision: 0
                    }
                },
                series: [
                    { valueField: "totalRecords", name: "Total Records" },
                    { valueField: "probabilityOver80", name: "Probability over 80%" },
                    { valueField: "opportunitiesWithDatacenters", name: "Opportunities with associated Data Centers" }
                ],
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center'
                },
                title: 'Salesforce DC Demand Statistics'
            };
    }
]);

