'use strict';

angular.module('datacollectors').controller('DcUpdateController',
    ['$scope', '$http', '$stateParams', '$location',
        'Authentication', 'Datacollectors', 'FileUploader','$rootScope',
        function($scope, $http, $stateParams, $location, Authentication,
                 Datacollectors, FileUploader,$rootScope) {

            console.log('This is dcUpdateController');

            function initDcList(){
                $http.get('/mongodata/?collectionName=DC_Facilities&subject=datacenter-listing').success(function(response) {
                    console.log('found ' + response.length + ' records for datacenter-listing');
                    response.forEach(function(record){
                        $scope.dcNames.push({name: record.DataCenterName, country: record.Country, siteCode: record.DCSiteID,sku: record.SKU});
                    });
                });
            }

            initDcList();

            $scope.buList = [
                {
                    name: 'GIS'
                },
                {
                    name: 'GBS'
                },
                {
                    name: 'EBG'
                }
            ];

            $scope.tenancyTypes = [
                {
                    name: 'Multi'
                },
                {
                    name: 'Single'
                },
                {
                    name: 'Cloud'
                },
                {
                    name: 'NPS'
                }
            ];

            $scope.contractTypes = [
                {
                    name: "Leased"
                },
                {
                    name: "Owned"
                },
                {
                    name: "CoLo"
                }

            ];

            $scope.workspaces =
                [
                    { id: 1, name: "dc" ,active:true  },
                    { id: 2, name: 'dc-2' ,active:false  }
                ];

            $scope.dcNames = [];

            $scope.dcRegions = [
                {
                    name: "Americas"
                },
                {
                    name: "EMEA"
                },
                {
                    name: "APAC"
                },
                {
                    name: "Nordics"
                },
                {
                    name: "UK & I"
                }
            ];

            $scope.overallStrategies = [
                {
                    name: "Close"
                },
                {
                    name: "Move"
                },
                {
                    name: "Maintain"
                },
                {
                    name:   "Grow"
                }

            ];

            $scope.datacenterTypes = [
                {
                    name: "CoLo"
                },
                {
                    name: "Leased"
                },
                {
                    name: "NPS"
                },
                {
                    name:   "Owned"
                },
                {
                    name:   "Partner"
                }

            ];

            $scope.strategicNatures = [
                {
                    name: "GIS-Multi"
                },
                {
                    name: "GIS-Single"
                },
                {
                    name: "GIS-Cloud"
                },
                {
                    name:   "NPS"
                }
            ];

            $scope.certifications = [
                {
                    name: "ITAR"
                },
                {
                    name: "SSAE 16"
                },
                {
                    name: "ISAE 3402"
                },
                {
                    name:   "ISO2000"
                },
                {
                    name:   "ISO27001"
                }
            ];

            $scope.networkNodeTypes = [
                {
                    name: "Gain"
                },
                {
                    name:   "Super-Gain"
                }
            ];

            $scope.selectedDcName=[{}];

            $scope.$watch(function(scope) {return  $scope.selectedDcName },
                function(newValue, oldValue) {
                    if(newValue[0]){
                        console.log('new value:  ' + newValue[0].name);
                    }

                    if(newValue[0]){
                        $scope.$parent.selectedName = newValue[0].name;

                        var result = $scope.dcNames.filter(function( obj ) {
                            $scope.dcCountry=newValue[0].country;
                            $scope.dcSiteCode = newValue[0].siteCode;
                            $scope.dcSku = newValue[0].sku;
                            return obj.DataCenterName == newValue[0];

                        });
                    }

                }
            );

            $scope.postUpdate = function(){
                console.log('playcard update  ');
                var postData = {
                    DataCenterName: $scope.selectedDcName,
                    StrategicNaturesOfDc: $scope.selectedStrategicNatures,
                    AnnualDirectLeaseCost: $scope.annualDirectLeaseCost,
                    DataCenterTypes: $scope.datacenterTypes,
                    TenancyTypes: $scope.selectedTenancyTypes,
                    NetworkNodeTypes: $scope.selectedNetworkNodeTypes,
                    KeyAccounts: $scope.keyAccounts,
                    SqFtTotal: $scope.totalSpace,
                    SqFtRaised: $scope.sqFtRaised,
                    PctUtilization: $scope.pctUtilization,
                    DcTier: $scope.dcSku,
                    ContractTypes: $scope.selectedContractTypes,
                    LeaseEnds: $scope.leaseEnds,
                    KwLeasedUtilized: $scope.kwLeasedUtilized,
                    AnnualCost: $scope.annualCost,
                    $kWL: $scope.$kWL,
                    Certifications: $scope.selectedCertifications,
                    DcManager:  $scope.dcManager,
                    DcRegeonalHead: $scope.dcRegionalManager,
                    CscSecurityLead:    $scope.cscSecurityLead,
                    ConsolidationStrategy:  $scope.consolidationStrategy,
                    OverallStrategies:    $scope.selectedOverallStrategies,
                    Region: $scope.selectedDcRegion,
                    BuildDate:  $scope.buildDate,
                    Vendor: $scope.vendor,
                    ValueOfUtilization: $scope.valueOfUtilization,
                    DatacenterAddress:  $scope.dcAddress,
                    DcProvider: $scope.dcProvider,
                    DcProviderContact:  $scope.dcProviderContact
                };
                var json = angular.toJson(postData);
                $http.post('/playcard_update', json);
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
                    { id: 1, name: "dc" ,active:true  },
                    { id: 2, name: 'dc-2' ,active:false  }
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
        }
    ]);

