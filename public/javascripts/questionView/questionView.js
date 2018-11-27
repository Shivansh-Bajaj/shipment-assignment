'use strict';

angular.module('myApp.questions', ['ngRoute', 'myApp.questionsService', 'myApp.answerService'])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/questions/:id', {
          templateUrl: 'javascripts/questionView/index.html',
          controller: 'questionController',
          css: 'javascripts/questionView/questionView.css'
      });
  }])
  .controller('questionController', [ '$scope', '$routeParams', 'questionsService', 'answerService', '$window', function($scope, $routeParams, questionsService, answerService, $window) {
    $scope.id = $routeParams.id;
    $scope.isFav = false;
    // checkFav()
    questionsService.fetch($scope.id)
        .then(resp => {
            $scope.data = resp.data;
            answerService.fetch(resp.data._id)
            .then(resp => {
                $scope.answers = resp.data;
            })
            .catch(err => {
                $scope.error = 'unable to fetch question';
                alert($scope.error);
            });
            questionsService.checkfav(resp.data._id)
            .then(resp => {
                $scope.isFav = resp.data;
            })
            .catch(err => {
                // $scope.error = 'unable to  question';
                // alert($scope.error);
            });
        })
        .catch(err => {
            $scope.error = 'unable to fetch question';
            alert($scope.error);
        });
    $scope.fav = function() {
        if (!$scope.isFav) {
            questionsService.addfav($scope.data._id)
            .then(resp => {
                $scope.isFav = !$scope.isFav;
            })
            .catch(err => {
                $scope.error = 'unable to fetch question';
                alert($scope.error);
            });
        } else {
            questionsService.remfav($scope.data._id)
            .then(resp => {
                $scope.isFav = !$scope.isFav;
            })
            .catch(err => {
                $scope.error = 'unable to fetch question';
                alert($scope.error);
            });
        }
    };
    $scope.addAnswer = function(answer) {
        answerService.add(answer, $scope.data._id)
        .then(resp => {
            $window.location.reload();
        })
        .catch(err => {
            $scope.error = 'unable to add answer';
            alert($scope.error);
            $window.location.reload();
        });
    };
    $scope.upvote = function(answer) {
        answerService.upvote(answer)
        .then(resp => {
            $window.location.reload();
        })
        .catch(err => {
            $scope.error = 'unable to upvote';
            alert($scope.error);
            $window.location.reload();
        });
    };
    $scope.downvote = function(answer) {
        answerService.downvote(answer)
        .then(resp => {
            $window.location.reload();
        })
        .catch(err => {
            $scope.error = 'unable to downvote';
            alert($scope.error);
            $window.location.reload();
        });
    };
  }]);