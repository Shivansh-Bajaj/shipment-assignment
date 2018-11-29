'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.authService',
    'myApp.questionsService',
    'myApp.view1',
    'myApp.dashboard',
    'myApp.questions',
    'myApp.profile',
    'ngTagsInput',
    // 'LocalStorageModule',
    'angularCSS'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/dashboard'});
    $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.getItem('token')) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
                    return config;
                } else {
                    if ($location.$$path == '/login') {
                        return config;
                    } else {
                        $location.path('/login');
                    };
                    return $q.reject(config);
                }
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
    // }
}])
.controller('mainCtrl', ['$scope', 'authService', '$location', '$window', function($scope, authService, $location, $window) {
    $scope.myId = "";
    if (authService.getToken() !== null) {
        authService.getUser($scope.id)
        .then(resp => {
            if (resp.status === 200) {
              $scope.myId = resp.data.data._id;
            } else {
              throw 'error';
            }
        })
        .catch(err => {
            $scope.error = 'unable to fetch user';
            alert($scope.error);
        });
    }

    $scope.isLogin = function() {
        return authService.getToken() !== null;
    };

    $scope.logout = function() {
        authService.logout();
        $window.location.reload();
    };
}]);
