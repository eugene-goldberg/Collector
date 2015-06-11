'use strict';

// Datacollectors controller
angular.module('datacollectors').controller('dataExplorerController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors) {
        $scope.authentication = Authentication;

        $scope.inputCategories = [
            {
                name: 'Cost Source Actuals',
                collectionName: 'Cost_Source_Actuals'
            },
            {
                name: 'Cost Source Budget',
                collectionName: 'Cost_Source_Budget'
            },
            {
                name: 'Chart of Accounts',
                collectionName: 'Chart_of_Accounts'
            },
            {
                name: 'Cost Center Master',
                collectionName: 'Cost_Center_Master'
            },
            {
                name: 'Headcount by Department Cost Center Labor',
                collectionName: 'Headcount_by_Department_Cost_Center_Labor'
            },
            {
                name: 'Fixed Asset Register',
                collectionName: 'Fixed_Asset_Register'

            },
            {
                name: 'AccountView Inventory',
                collectionName: 'AccountView_Inventory'

            },
            {
                name: 'DC Facilities',
                collectionName: 'DC_Facilities'

            },
            {
                name: 'GL accounts',
                collectionName: 'GL_accounts'

            },
            {
                name: 'NextGen data',
                collectionName: 'NextGen_data'

            },
            {
                name: 'Profit and Loss data',
                collectionName: 'Profit_and_Loss_data'

            },
            {
                name: 'Vendors',
                collectionName: 'Vendors'
            }
        ];

        $scope.dataVersionValues = [

        ];

        var collectionName;

        var selectedCategory;

        var selectedDataVersion;

        $scope.collectionMetadata = {};

        $scope.collectionDatafields = [];

        $scope.getDataVersionsForSelectedCategory = function(data){
          console.log('Selected category:  ' + data.name);

            selectedCategory = data.name;
            angular.forEach( $scope.outputCategories, function( value, key ) {
                collectionName = value.collectionName;
            });
            $http({
                method: 'GET',
                url: '/collections_metadata/?' + collectionName
            }).success(function(data){
                // With the data succesfully returned, call our callback
                $scope.collectionMetadata = data;

                $scope.dataVersionValues = [];

                var propValue;
                for(var propName in data) {
                    propValue = data[propName];

                    var dataVersions = propValue.dataVersions;

                    dataVersions.forEach(function(version){
                        console.log('Data Version:  ' + version);

                        $scope.dataVersionValues.push({name: version});
                    });
                }
            }).error(function(){
                alert('error');
            });
        };

        $scope.getSelectedDataVersion = function(data){
            console.log('Selected data version is:  ' + data.name);
            selectedDataVersion = data.name;
        };

        $scope.getData = function() {
            angular.forEach( $scope.outputCategories, function( value, key ) {
                collectionName = value.collectionName;
            });
            $http({
                method: 'GET',
                url: '/mongodata/?collectionName=' + collectionName + '&dataVersion=' + selectedDataVersion
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

        console.log('$scope.people:  ' + $scope.people);

        function getColumns(){

            var columnList = ['Line #','Region','FY15 TCO','FY16 Budget','Comments/Source',
                'Data Center','Address','Type','Lease Expiration','DCM Lead','CCE Lead',
                'CCE Service Type','JCI Lead','JCI Service Type'];

            var columns = [];

            columnList.forEach(function(column){
                columns.push({dataField: column, caption: column, visible: false});
            });

            return columns;
        }

        $scope.gridOptions = {
            bindingOptions: {
                dataSource: 'data',
                columns: 'collectionDatafields'
            },
            grouping: {
                autoExpandAll: true
            },
            groupPanel: {
                visible: true
            },
            filterRow: {
                visible: true,
                applyFilter: 'auto'
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Search...'
            },
            paging: {
                enabled: true,
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20]
            },
            rowAlternationEnabled: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            columnChooser:  {
                enabled: true

            },
            selection: {
                mode: 'multiple'
            }
        };
    }
]);
