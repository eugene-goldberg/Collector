'use strict';

// FileUploadController controller
angular.module('datacollectors').controller('FileUploadController',
    ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Datacollectors', 'FileUploader',
    function($scope, $http, $stateParams, $location, Authentication, Datacollectors, FileUploader) {
        $scope.authentication = Authentication;

        $scope.uploadUrl = '';

        var url = 'http://dctool-lnx.cloudapp.net:3001/api/files';

        var uploader = $scope.uploader = new FileUploader({
        });

        console.log('This is FileUploadController');

        function getEnvironment (){

                $http.get('/environment').success(function(response) {

                if(response.environment === 'test'){
                     url = 'http://dctool-lnx.cloudapp.net:3001/api/files';
                    initUploader(url);

                }
                if(response.environment === 'development'){
                  url = 'http://localhost:3000/api/files';

                    initUploader(url);

                }
                //console.log('Current Environment is:  ' + $scope.currentEnvironment
                //+ '  so the uploadUrl should be:  ' + url);
            });
        }

        function initUploader(url){
            uploader.url = url;

            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                //console.info('onAfterAddingFile', fileItem);
                this.url = url;
                console.log('uploader.url is:  ' + url);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };

            uploader.onBeforeUploadItem = function(item) {
                angular.forEach( $scope.outputCategories, function( value, key ) {
                    selectedCategory = value.name;
                    item.formData.push({subjectCategory: selectedCategory});
                });
                angular.forEach( $scope.outputDataVersions, function( value, key ) {
                    selectedDataVersion = value.name;
                    item.formData.push({dataVersion: selectedDataVersion});
                });

                item.formData.push({
                    tabName: $scope.workspace.name,
                    originalDocumentName: $scope.originalDocumentName,
                    subject:    $scope.subject,
                    documentAuthor: $scope.documentAuthor,
                    dateDocumentProduced: $scope.dateDocumentProduced,
                    dateDocumentReceived: $scope.dateDocumentReceived,
                    documentSubmitter: $scope.documentSubmitter,
                    documentReviewer:   $scope.documentReviewer,
                    originalSource: $scope.originalSource,
                    dataFields: $scope.dataFields
                });
                console.info('onBeforeUploadItem', item);
                console.info('contentType:  ', $scope.contentType);
            };

            uploader.onProgressItem = function(fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                // console.info('onErrorItem', fileItem, response, status, headers);
                alert('UPLOAD ERROR!!!')
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                //console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');

            };
        }

        getEnvironment();

        var selectedCategory;
        var selectedDataVersion;

        $scope.inputCategories = [
            {
                name: 'Cost Source Actuals'
            },
            {
                name: 'Cost Source Budget'
            },
            {
                name: 'Chart of Accounts'
            },
            {
                name: 'Cost Center Master'
            },
            {
                name: 'Headcount by Department Cost Center Labor'
            },
            {
                name: 'Fixed Asset Register'
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
                name: 'Vendors'
            }
        ];

        $scope.dataVersionValues = [
            {
                name: '1'
            },
            {
                name: '2'
            },
            {
                name: '3'
            }
        ];

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

        $scope.workspaces =
            [
                { id: 1, name: "dc" ,active:true  },
                { id: 2, name: 'dc-2' ,active:false  }
            ];

        $scope.dcNames = [
            {
                name: "Newark"
            },
            {
                name: "Meriden"
            },
            {
                name: "Chicago"
            },
            {
                name: "Ottawa"
            }
        ];

        $scope.selectedDcName=[{}];

        //$scope.selectedDcName = [{name: "dc", ticked: true}];



        $scope.$watch(function(scope) {return  $scope.selectedDcName },
            function(newValue, oldValue) {
                if(newValue[0]){
                    console.log('new value:  ' + newValue[0].name);
                }

                if(newValue[0]){
                    $scope.$parent.selectedName = newValue[0].name;
                }

            }
        );

        $scope.selectedYear="";

        $scope.postUpdate = function(){
            console.log('kwRequired  ' + $scope.kwRequired);
            var postData = {
                opportunityId: $scope.opportunityId,
                opportunityName: $scope.opportunityName,
                accountName: $scope.accountName,
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
                kwRequired_2025: $scope.kwRequired_2025
            };
            var json = angular.toJson(postData);
            $http.post('/salesforce_update', json);
        };

        /////////////////////// TabController's functionality:

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


        ///////////////////////////
    }
]);
