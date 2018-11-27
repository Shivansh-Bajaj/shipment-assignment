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
}]);