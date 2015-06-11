'use strict';

angular.module('datacollectors')
    .controller('TabController', ['$scope','$http', function ($scope, $http) {
        console.log('This is TabController');
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
                name: 'Sheet ' + id,
                active: true
            });
        };

        $scope.workspaces =
            [
                { id: 1, name: 'Newark' ,active:true  },
                { id: 2, name: 'Meriden' ,active:false  }
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
    }]);

