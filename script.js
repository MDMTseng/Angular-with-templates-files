



var RCarModule = angular.module('Basic_App', ['MyDireModule']);
RCarModule.controller('TopCtrl', ['$scope',
function($scope) {
	$scope.tdata = "data in main ctrl";

}]);