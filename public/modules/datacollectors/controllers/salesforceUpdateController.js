'use strict';

angular.module('datacollectors').controller('SalesforceUpdateController',
    ['$scope', '$http', '$stateParams', '$location',
        'Authentication', 'Datacollectors',
        'FileUploader','$rootScope','$window','$sce',
    function($scope, $http, $stateParams, $location, Authentication,
             Datacollectors, FileUploader,$rootScope,$window,$sce) {
        $scope.authentication = Authentication;

        var user = Authentication.user;

        $scope.uploadUrl = '';

        $scope.quote;

        $scope.selectedOpportunity = [];

        $scope.isAdmin = false;

        function assertIsAdmin(){
            var isAdmin = user.roles.indexOf('admin');
            if(isAdmin > 0){
                $scope.isAdmin = true;
            }
            else {
                $scope.isAdmin = false;
            }
        }

        var url = 'http://dctool-lnx.cloudapp.net:3001/api/files';

        var uploader = $scope.uploader = new FileUploader({
        });

        console.log('This is FileUploadController');

        function getEnvironment (){

                $http.get('/environment').success(function(response) {

                if(response.environment === 'test'){

                }
                if(response.environment === 'development'){

                }
            });
        }

        function initOpportunityIdList(){
            $http.get('/opportunity_ids').success(function(response) {
                console.log('found ' + response.length + ' records for salesforce-power');
                response.forEach(function(opportunity){
                    $scope.opportunityIds.push(opportunity);
                });
            });
        }

        function initDcList(){
            $http.get('/mongodata/?collectionName=DC_Facilities&subject=datacenter-listing').success(function(response) {
                console.log('found ' + response.length + ' records for datacenter-listing');
                response.forEach(function(record){
                    $scope.dcNames.push({name: record.DataCenterName, country: record.Country, siteCode: record.DCSiteID,sku: record.SKU});
                });
            });
        }

        $scope.getOpportunityDetails = function(opportunityId){
            $http.get('/opportunities/?opportunityId=' + opportunityId).success(function(response) {

                for(var prop in response){
                    console.log('response prop: ' + prop);
                    console.log('response prop value: ' + response[prop]);
                }
                $scope.selectedOpportunityId = response.CSCOpportunityID;
                $scope.opportunityName = response.OpportunityName;
                $scope.accountName = response.AccountName;
                $scope.solutionExecutiveName = response.SolutionExecutiveName;
                $scope.solutionArchitectName = response.SolutionArchitectName;
                $scope.opportunityOwner = response.OpportunityOwner;
                $scope.noDcInTheDeal = response.NoDcInTheDeal;

                console.log('response: ' + response);
                console.log('opportunityName: ' + $scope.opportunityName);
                console.log('accountName: ' + $scope.accountName);

                $scope.selectedOpportunity.push(response);
            });
        };

        function getOpportunityDetails(opportunityId){
            $http.get('/opportunities/?opportunityId=' + opportunityId).success(function(response) {

                for(var prop in response){
                    console.log('response prop: ' + prop);
                    console.log('response prop value: ' + response[prop]);
                }
                    $scope.opportunityName = response.OpportunityName;
                    $scope.accountName = response.AccountName;
                    $scope.solutionExecutiveName = response.SolutionExecutiveName;
                    $scope.solutionArchitectName = response.SolutionArchitectName;
                    $scope.opportunityOwner = response.OpportunityOwner;
                    $scope.noDcInTheDeal = response.NoDcInTheDeal;

                console.log('response: ' + response);
                console.log('opportunityName: ' + $scope.opportunityName);
                console.log('accountName: ' + $scope.accountName);

            });
        }

        function getDataCenterDetail(opportunityId, dcName){
            $scope.kwRequired_2016 = '';
            $scope.kwRequired_2017 = '';
            $scope.kwRequired_2018 = '';
            $scope.kwRequired_2019 = '';
            $scope.kwRequired_2020 = '';
            $scope.kwRequired_2021 = '';
            $scope.kwRequired_2022 = '';
            $scope.kwRequired_2023 = '';
            $scope.kwRequired_2024 = '';
            $scope.kwRequired_2025 = '';

            $scope.cbRequired_2016 = '';
            $scope.cbRequired_2017 = '';
            $scope.cbRequired_2018 = '';
            $scope.cbRequired_2019 = '';
            $scope.cbRequired_2020 = '';
            $scope.cbRequired_2021 = '';
            $scope.cbRequired_2022 = '';
            $scope.cbRequired_2023 = '';
            $scope.cbRequired_2024 = '';
            $scope.cbRequired_2025 = '';

            $scope.dcCountry = '';
            $scope.dcSiteCode = '';
            $scope.dcSku = '';

            $scope.computeCheckboxModel.cloudCompute = false;
            $scope.computeCheckboxModel.bizCloudHc = false;
            $scope.computeCheckboxModel.bizCloud = false;
            $scope.computeCheckboxModel.storageAsAService = false;
            $scope.computeCheckboxModel.mainframe = false;
            $scope.computeCheckboxModel.unixFarm = false;
            $scope.computeCheckboxModel.windowsFarm = false;
            $scope.computeCheckboxModel.as400 = false;
            $scope.computeCheckboxModel.myWorkstyle = false;
            $scope.computeCheckboxModel.cyber = false;
            $scope.computeCheckboxModel.serviceManagement = false;
            $scope.computeCheckboxModel.lan = false;
            $scope.computeCheckboxModel.wan = false;

            $http.get('/salesforce_dc_data/?opportunityId=' + opportunityId +'&dcName=' + dcName).success(function(response) {

            if(response === "no-match"){
                console.log('did not get any matching data centers');
                var matchingDcRecord = $scope.dcNames.filter(function (entry) { return entry.name === dcName; });
                console.log('matchingDcRecord[0].country: ' + matchingDcRecord[0].country);
                console.log('matchingDcRecord[0].siteCode: ' + matchingDcRecord[0].siteCode);
                $scope.dcCountry = matchingDcRecord[0].country;
                $scope.dcSiteCode = matchingDcRecord[0].siteCode;
            }
                else {
            $scope.kwRequired_2016 = response.kwFY16;
            $scope.kwRequired_2017 = response.kwFY17;
            $scope.kwRequired_2018 = response.kwFY18;
            $scope.kwRequired_2019 = response.kwFY19;
            $scope.kwRequired_2020 = response.kwFY20;
            $scope.kwRequired_2021 = response.kwFY21;
            $scope.kwRequired_2022 = response.kwFY22;
            $scope.kwRequired_2023 = response.kwFY23;
            $scope.kwRequired_2024 = response.kwFY24;
            $scope.kwRequired_2025 = response.kwFY25;

            $scope.cbRequired_2016 = response.cbFY16;
            $scope.cbRequired_2017 = response.cbFY17;
            $scope.cbRequired_2018 = response.cbFY18;
            $scope.cbRequired_2019 = response.cbFY19;
            $scope.cbRequired_2020 = response.cbFY20;
            $scope.cbRequired_2021 = response.cbFY21;
            $scope.cbRequired_2022 = response.cbFY22;
            $scope.cbRequired_2023 = response.cbFY23;
            $scope.cbRequired_2024 = response.cbFY24;
            $scope.cbRequired_2025 = response.cbFY25;

            $scope.dcCountry = response.DCCountry;
            $scope.dcSiteCode = response.DCSiteCode;
            $scope.dcSku = response.DCSKU;

               $scope.computeCheckboxModel.cloudCompute = response.cloudCompute;
               $scope.computeCheckboxModel.bizCloudHc = response.bizCloudHc;
               $scope.computeCheckboxModel.bizCloud = response.bizCloud;
               $scope.computeCheckboxModel.storageAsAService = response.storageAsAService;
               $scope.computeCheckboxModel.mainframe = response.mainframe;
               $scope.computeCheckboxModel.unixFarm = response.unixFarm;
               $scope.computeCheckboxModel.windowsFarm = response.windowsFarm;
               $scope.computeCheckboxModel.as400 = response.as400;
               $scope.computeCheckboxModel.myWorkstyle = response.myWorkstyle;
               $scope.computeCheckboxModel.cyber = response.cyber;
               $scope.computeCheckboxModel.serviceManagement = response.serviceManagement;
               $scope.computeCheckboxModel.lan = response.lan;
               $scope.computeCheckboxModel.wan = response.wan;
            }

            });
        }

        assertIsAdmin();

        getEnvironment();

        initOpportunityIdList();

        initDcList();

        $scope.years = [
            {
                name: "2016"
            },
            {
                name: "2017"
            },
            {
                name: "2018"
            },
            {
                name: "2019"
            },
            {
                name: "2020"
            },
            {
                name: "2021"
            },
            {
                name: "2022"
            },
            {
                name: "2023"
            },
            {
                name: "2024"
            }
        ];

        $scope.dcNames = [];

        $scope.opportunityIds = [];

        $scope.selectedDcName=[{}];

        //$scope.selectedDcName = [{name: "dc", ticked: true}];

        $scope.$watch(function(scope) {return  $scope.selectedDcName },
            function(newValue, oldValue) {
                if(newValue[0]){
                    console.log('new value:  ' + newValue[0].name);
                }

                if(newValue[0]){
                    $scope.$parent.selectedName = newValue[0].name;
                    if($scope.selectedOpportunity){
                        if($scope.selectedOpportunity[0].name){
                            getDataCenterDetail($scope.selectedOpportunity[0].name,newValue[0].name);
                        }
                        else {
                            getDataCenterDetail($scope.selectedOpportunityId,newValue[0].name);
                        }

                    }
                }

            }
        );

        $scope.$watch(function(scope) {return  $scope.selectedOpportunity },
            function(newValue, oldValue) {
                if(newValue){
                    if(newValue[0]){
                        console.log('new opportunity id:  ' + newValue[0].name);
                        getOpportunityDetails(newValue[0].name);
                    }
                }
            }
        );

        $scope.selectedYear="";

        $scope.postUpdate = function(){
            var oppId;

            if($scope.selectedOpportunityId !== undefined){
                oppId = $scope.selectedOpportunityId;
            }
            else {
                    oppId = $scope.selectedOpportunity[0].name;
            }

            var postData = {
                opportunityId: oppId,
                opportunityName: $scope.opportunityName,
                accountName: $scope.accountName,
                opportunityOwner: $scope.opportunityOwner,
                solutionExecutiveName: $scope.solutionExecutiveName,
                solutionArchitectName: $scope.solutionArchitectName,
                noDcInTheDeal: $scope.noDcInTheDeal,
                dcName: $scope.$parent.selectedName,
                dcCountry: $scope.dcCountry,
                dcSiteCode: $scope.dcSiteCode,
                dcSku: $scope.dcSku,
                kwRequired_2016: $scope.kwRequired_2016,
                kwRequired_2017: $scope.kwRequired_2017,
                kwRequired_2018: $scope.kwRequired_2018,
                kwRequired_2019: $scope.kwRequired_2019,
                kwRequired_2020: $scope.kwRequired_2020,
                kwRequired_2021: $scope.kwRequired_2021,
                kwRequired_2022: $scope.kwRequired_2022,
                kwRequired_2023: $scope.kwRequired_2023,
                kwRequired_2024: $scope.kwRequired_2024,
                kwRequired_2025: $scope.kwRequired_2025,

                cbRequired_2016: $scope.cbRequired_2016,
                cbRequired_2017: $scope.cbRequired_2017,
                cbRequired_2018: $scope.cbRequired_2018,
                cbRequired_2019: $scope.cbRequired_2019,
                cbRequired_2020: $scope.cbRequired_2020,
                cbRequired_2021: $scope.cbRequired_2021,
                cbRequired_2022: $scope.cbRequired_2022,
                cbRequired_2023: $scope.cbRequired_2023,
                cbRequired_2024: $scope.cbRequired_2024,
                cbRequired_2025: $scope.cbRequired_2025,

                cloudCompute:   $scope.computeCheckboxModel.cloudCompute,
                bizCloudHc: $scope.computeCheckboxModel.bizCloudHc,
                bizCloud:   $scope.computeCheckboxModel.bizCloud,
                storageAsAService:  $scope.computeCheckboxModel.storageAsAService,
                mainframe:  $scope.computeCheckboxModel.mainframe,
                unixFarm:   $scope.computeCheckboxModel.unixFarm,
                windowsFarm: $scope.computeCheckboxModel.windowsFarm,
                as400:  $scope.computeCheckboxModel.as400,
                myWorkstyle: $scope.computeCheckboxModel.myWorkstyle,
                cyber:  $scope.computeCheckboxModel.cyber,
                serviceManagement: $scope.computeCheckboxModel.serviceManagement,
                lan:    $scope.computeCheckboxModel.lan,
                wan:    $scope.computeCheckboxModel.wan
            };

            var json = angular.toJson(postData);
            $http.post('/salesforce_update', json)
                .then(function(result)
                {
                    setTimeout(function(){
                        $http.get("/salesforce_quote/?fileName=" + result.data,
                            {headers: { 'Accept': 'application/pdf' },
                                responseType: 'arraybuffer' })
                            .success(function(data) {
                                var file = new Blob([data], {type: 'application/pdf'});
                                var fileURL = URL.createObjectURL(file);

                                var newTab = $window.open('about:blank', '_blank');
                                newTab.document.write("<object width='600' height='400' data='" + fileURL + "' type='"+ 'application/pdf' +"' ></object>");
                            });
                    }, 1000);


                });
        };

        $scope.getSalesforceQuote = function(){

            $http.get("/salesforce_quote/?fileName=" + $scope.quote,
            {headers: { 'Accept': 'application/pdf' },
                responseType: 'arraybuffer' })
                .success(function(data) {
                    var file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);

                    var newTab = $window.open('about:blank', '_blank');
                    newTab.document.write("<object width='600' height='400' data='" + fileURL + "' type='"+ 'application/pdf' +"' ></object>");
                });
        };

        var setAllInactive = function() {
            angular.forEach($scope.workspaces, function(workspace) {
                workspace.active = false;
            });
        };

        $scope.activeWorkspaceSheetName = function(){
            $scope.workspaces.forEach(function(workspace) {
                if(workspace.active){
                    return workspace.name;
                }
            });
        };

        var addNewWorkspace = function() {
            var id = $scope.workspaces.length + 1;
            $scope.workspaces.push({
                id: id,
                name:  "dc-" + id,
                active: true
            });
        };

        $scope.workspaces =
            [
                { id: 1, name: "dc1" ,active:true  }
            ];

        $scope.addWorkspace = function () {
            setAllInactive();
            addNewWorkspace();
        };

        $scope.removeWorkspace = function() {
            angular.forEach($scope.workspaces, function(workspace) {
                if(workspace.active){
                    var index = $scope.workspaces.indexOf(workspace);
                    console.log('Active Workspace id: ' + index);
                    $scope.workspaces.splice(index,1);
                }
            });
        };

        $scope.computeCheckboxModel = {
            cloudCompute : false,
            bizCloudHc : false,
            bizCloud:   false,
            storageAsAService:  false,
            mainframe:  false,
            unixFarm:   false,
            windowsFarm:    false,
            as400:  false,
            UcaaS:  false,
            myWorkstyle:    false,
            cyber:  false,
            serviceManagement:  false,
            lan:    false,
            wan:    false
        };
    }
]);
