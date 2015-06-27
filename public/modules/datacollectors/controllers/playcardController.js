'use strict';

angular.module('datacollectors').controller('PlaycardController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors) {
        $scope.authentication = Authentication;

        $scope.playcards = [];

        $scope.selectedDcName=[{}];

        $scope.playcard = {
            dcName: "",
            dcTier: "",
            contractType: "",
            leaseEnds: "",
            kWlUtil:    "",
            annualCost: "",
            $kWl:   "",
            certifications: "",
            dcManager:  "",
            dcSecurityLead: "",
            regionalHead:   "",
            buildDate:  "",
            vendor: "",
            valueOfUtilization: "",
            dcAddress:  "",
            dcProvider: "",
            dcProviderContact:    "",
            consolidationStrategy:  [],
            annualDirectLeaseCost:  "",
            keyAccounts: [],
            sqFtTotal:  "",
            sqFtRaised: "",
            pctUtilization: ""
        };

        function getPlaycardsData(dcName) {
            $http({
                method: 'GET',
                url: '/playcards_data/?dcName=' + dcName
            }).success(function(data){
                $scope.playcards = data;
                {
                    $scope.playcard.dcName = $scope.playcards[0].DataCenterName;
                    $scope.playcard.dcTier = $scope.playcards[0].DcTier;
                    $scope.playcard.contractType = $scope.playcards[0].ContractTypes;
                    $scope.playcard.leaseEnds = $scope.playcards[0].LeaseEnds;
                    $scope.playcard.kWlUtil =    $scope.playcards[0].KwLeasedUtilized;
                    $scope.playcard.annualCost = $scope.playcards[0].AnnualCost;
                    $scope.playcard.$kWl =   $scope.playcards[0].KWL;
                    $scope.playcard.certifications = $scope.playcards[0].Certifications;
                    $scope.playcard.dcManager =  $scope.playcards[0].DcManager;
                    $scope.playcard.dcSecurityLead = $scope.playcards[0].CscSecurityLead;
                    $scope.playcard.regionalHead =   $scope.playcards[0].DcRegeonalHead;
                    $scope.playcard.buildDate =  $scope.playcards[0].BuildDate;
                    $scope.playcard.vendor = $scope.playcards[0].Vendor;
                    $scope.playcard.valueOfUtilization = $scope.playcards[0].ValueOfUtilization;
                    $scope.playcard.dcAddress =  $scope.playcards[0].DatacenterAddress;
                    $scope.playcard.dcProvider = $scope.playcards[0].DcProvider;
                    $scope.playcard.dcProviderContact =    $scope.playcards[0].DcProviderContact;
                    $scope.playcard.annualDirectLeaseCost =  $scope.playcards[0].AnnualDirectLeaseCost;

                    $scope.playcard.consolidationStrategy =  $scope.playcards[0].ConsolidationStrategy.split(",");
                    $scope.playcard.keyAccounts = $scope.playcards[0].KeyAccounts.split(",");

                    $scope.playcard.sqFtTotal =  $scope.playcards[0].SqFtTotal;
                    $scope.playcard.sqFtRaised = $scope.playcards[0].SqFtRaised;
                    $scope.playcard.pctUtilization = $scope.playcards[0].PctUtilization;
                }
            }).error(function(){
                alert('error');
            });
        }

        $scope.dcNames = [];

        function initDcList(){
            $http.get('/playcards_dc_list').success(function(response) {
                //console.log('found ' + response.length + ' records for datacenter-listing');
                response.forEach(function(record){
                    $scope.dcNames.push({name: record.DataCenterName});
                });
            });
        }

        $scope.$watch(function(scope) {return  $scope.selectedDcName },
            function(newValue, oldValue) {
                if(newValue){
                    if(newValue[0]) {
                        if(newValue[0].name) {
                            getPlaycardsData(newValue[0].name);
                        }
                    }
                }
            }
        );

        initDcList();
    }
]);

