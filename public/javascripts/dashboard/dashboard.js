'use strict';

angular.module('myApp.dashboard', ['ngRoute', 'ngTagsInput', 'myApp.questionsService'])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/dashboard', {
          templateUrl: 'javascripts/dashboard/dashboard.html',
          controller: 'dashboardController',
          css: 'javascript/dashbaord/dashbaord.css'
      });
  }])
  .controller('dashboardController', [ '$scope', 'questionsService', '$location', '$window',function($scope, questionsService, $location, $window) {
    $scope.title = "";
    $scope.body = "";
    $scope.error = "";
    $scope.tags = [];
    $scope.data = [];
    $scope.search = "";
    questionsService.fetchAll()
    .then(resp => {
        $scope.data = resp.data;
        $scope.error = ""; 
    })
    .catch(err => {
        $scope.error = 'unable to fetch questions';
    });
    $scope.add = function(title, body, tags) {
        if (title != "" && body != "") {
            tags = tags.map(tag => {return {name: tag.text}});
            questionsService.add(title, body, tags)
            .then(resp => {
                $window.location.reload();
            })
            .catch(err => {
                $scope.error = 'unable to add questions';
                alert($scope.error);
                $window.location.reload();
            });
        }
    }
    // $scope.loadTags = function(query) {
    //      return $http.get('/tags?query=' + query);
    // };
  }]);