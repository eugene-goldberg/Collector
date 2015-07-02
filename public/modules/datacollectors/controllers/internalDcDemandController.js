'use strict';

angular.module('datacollectors').controller('InternalDcDemandController',
    ['$scope', '$http', '$stateParams', '$location',
        'Authentication', 'Datacollectors',
        'FileUploader','$rootScope','$window','$sce',
        function($scope, $http, $stateParams, $location, Authentication,
                 Datacollectors, FileUploader,$rootScope,$window,$sce) {

            $scope.dcNames = [];

            $scope.internalDcDemands = [];

            $scope.selectedDcName;

            $scope.selectedInternalDcDemand;

            function initDcList(){
                $http.get('/mongodata/?collectionName=DC_Facilities&subject=datacenter-listing').success(function(response) {
                    console.log('found ' + response.length + ' records for datacenter-listing');
                    response.forEach(function(record){
                        $scope.dcNames.push({name: record.DataCenterName, country: record.Country, siteCode: record.DCSiteID,sku: record.SKU});
                    });
                });
            }

            function initInternalDcDemandList(){
                $http.get('/internal_dc_demand_data/').success(function(response) {
                    console.log('found ' + response.length + ' records for internal DC demands');
                    response.forEach(function(record){
                        $scope.internalDcDemands.push({name: record.RequestTitle});
                    });
                });
            }

            $scope.$watch(function(scope) {return  $scope.selectedDcName },
                function(newValue, oldValue) {
                    if(newValue){
                        if(newValue[0]){
                            $scope.$parent.selectedName = newValue[0].name;

                            var matchingDcRecord = $scope.dcNames.filter(function (entry) { return entry.name === newValue[0].name; });
                            $scope.dcCountry = matchingDcRecord[0].country;
                            $scope.dcSiteCode = matchingDcRecord[0].siteCode;
                        }
                    }
                }
            );

            $scope.$watch(function(scope) {return  $scope.selectedInternalDcDemand },
                function(newValue, oldValue) {
                    if(newValue){
                        if(newValue[0]){
                            $scope.$parent.selectedName = newValue[0].name;
                            $http.get('/internal_dc_demand_detail/?requestTitle=' + newValue[0].name).success(function(response) {
                                $scope.requestTitle = response[0].RequestTitle;
                                $scope.requestDescription = response[0].RequestDescription;
                                $scope.requestorName = response[0].RequestorName;

                                $scope.selectedDc = response[0].DataCenterName;
                                //$scope.selectedDcName.push(response);
                                //$scope.selectedDcName[0].name = response[0].DataCenterName;
                                $scope.dcCountry = response[0].DCCountry;
                                $scope.dcSiteCode = response[0].DCSiteCode;

                                $scope.kwRequired_2016 = response[0].kwFY16;
                                $scope.kwRequired_2017 = response[0].kwFY17;
                                $scope.kwRequired_2018 = response[0].kwFY18;
                                $scope.kwRequired_2019 = response[0].kwFY19;
                                $scope.kwRequired_2020 = response[0].kwFY20;
                                $scope.kwRequired_2021 = response[0].kwFY21;
                                $scope.kwRequired_2022 = response[0].kwFY22;
                                $scope.kwRequired_2023 = response[0].kwFY23;
                                $scope.kwRequired_2024 = response[0].kwFY24;
                                $scope.kwRequired_2025 = response[0].kwFY25;

                                $scope.cbRequired_2016 = response[0].cbFY16;
                                $scope.cbRequired_2017 = response[0].cbFY17;
                                $scope.cbRequired_2018 = response[0].cbFY18;
                                $scope.cbRequired_2019 = response[0].cbFY19;
                                $scope.cbRequired_2020 = response[0].cbFY20;
                                $scope.cbRequired_2021 = response[0].cbFY21;
                                $scope.cbRequired_2022 = response[0].cbFY22;
                                $scope.cbRequired_2023 = response[0].cbFY23;
                                $scope.cbRequired_2024 = response[0].cbFY24;
                                $scope.cbRequired_2025 = response[0].cbFY25;

                                $scope.computeCheckboxModel.cloudCompute = response[0].cloudCompute;
                                $scope.computeCheckboxModel.bizCloudHc = response[0].bizCloudHc;
                                $scope.computeCheckboxModel.bizCloud = response[0].bizCloud;
                                $scope.computeCheckboxModel.storageAsAService = response[0].storageAsAService;
                                $scope.computeCheckboxModel.mainframe = response[0].mainframe;
                                $scope.computeCheckboxModel.unixFarm = response[0].unixFarm;
                                $scope.computeCheckboxModel.windowsFarm = response[0].windowsFarm;
                                $scope.computeCheckboxModel.as400 = response[0].as400;
                                $scope.computeCheckboxModel.myWorkstyle = response[0].myWorkstyle;
                                $scope.computeCheckboxModel.cyber = response[0].cyber;
                                $scope.computeCheckboxModel.serviceManagement = response[0].serviceManagement;
                                $scope.computeCheckboxModel.lan = response[0].lan;
                                $scope.computeCheckboxModel.wan = response[0].wan;
                            });
                        }
                    }
                }
            );

            $scope.postUpdate = function(){

                if($scope.selectedDcName !== undefined){

                    var selectedDc;

                    if($scope.selectedDc !== undefined){
                        selectedDc = $scope.selectedDc;
                    }
                    else {
                        selectedDc = $scope.selectedDcName[0].name;
                    }

                    var postData = {
                        requestTitle: $scope.requestTitle,
                        requestDescription: $scope.requestDescription,
                        requestorName: $scope.requestorName,

                        dcName: selectedDc,
                        dcCountry: $scope.dcCountry,
                        dcSiteCode: $scope.dcSiteCode,

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
                }

                var json = angular.toJson(postData);
                $http.post('/internal_dc_demand_update', json)
                    .then(function(result)
                    {
                        setTimeout(function(){
                            $http.get("/internal_dc_quote/?fileName=" + result.data,
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


            initDcList();

            initInternalDcDemandList();

        }]);
