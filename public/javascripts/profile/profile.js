'use strict';

angular.module('myApp.profile', ['ngRoute', 'myApp.authService'])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/profile/:id', {
          templateUrl: 'javascripts/profile/index.html',
          controller: 'profileController',
          css: 'javascripts/profile/profile.css'
      });
  }])
  .controller('profileController', [ '$scope', '$routeParams', 'authService', '$window', function($scope, $routeParams, authService, $window) {
    $scope.id = $routeParams.id;
    authService.getUser($scope.id)
        .then(resp => {
            if (resp.status === 200) {
              $scope.data = resp.data.data;
            } else {
              throw 'error';
            }
        })
        .catch(err => {
            $scope.error = 'unable to fetch user';
            alert($scope.error);
        });
  }]);