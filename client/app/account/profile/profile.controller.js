'use strict';

angular.module('stackStoreApp')
  .controller('ProfileCtrl', function ($scope, $http, Auth) {
	$scope.user = Auth.getPopulatedUser();
	console.log($scope.user);
	
	// $http.get('/api/users/me').success(function(user) {
	// 	$scope.user = user;
	// });

  });
