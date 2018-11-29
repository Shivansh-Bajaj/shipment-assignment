'use strict';

angular.module('myApp.dashboard', ['ngRoute', 'ngTagsInput', 'myApp.questionsService'])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/dashboard', {
          templateUrl: 'javascripts/dashboard/dashboard.html',
          controller: 'dashboardController',
          css: 'javascripts/dashboard/dashboard.css'
      });
  }])
  .controller('dashboardController', [ '$scope', 'questionsService', '$location', '$window',function($scope, questionsService, $location, $window) {
    $scope.title = "";
    $scope.body = "";
    $scope.error = "";
    $scope.tags = [];
    $scope.newtags = [];
    $scope.data = [];
    $scope.forTag = "";
    $scope.search = "";
    questionsService.fetchAll()
    .then(resp => {
        $scope.data = resp.data;
        $scope.error = ""; 
    })
    .catch(err => {
        $scope.error = 'unable to fetch questions';
    });
    questionsService.fetchTags()
    .then(resp => {
        $scope.tags = resp.data;
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
    };
    $scope.getByTag = function(tag, name) {
        questionsService.fetchByTag(tag)
        .then(resp => {
            $scope.data = resp.data;
            $scope.forTag = name;
            $scope.error = ""; 
        })
        .catch(err => {
            $scope.error = 'unable to fetch questions';
            alert($scope.error);
            $window.location.reload();
        });
    }

    // $scope.loadTags = function(query) {
    //      return $http.get('/tags?query=' + query);
    // };
  }]);