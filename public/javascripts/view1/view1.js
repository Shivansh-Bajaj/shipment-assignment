'use strict';

angular.module('myApp.view1', ['ngRoute', 'myApp.authService'])

    .config(['$routeProvider', function($routeProvider, authService) {
        $routeProvider.when('/login', {
            templateUrl: 'javascripts/view1/view1.html',
            controller: 'View1Ctrl',
            css: 'javascripts/view1/view1.css'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'authService', '$location',
        function($scope, authService, $location) {
            $scope.tabKey = 'login';
            $scope.username = '';
            $scope.password = '';
            $scope.tab = function(tab) {
                $scope.tabKey = tab;
            };
            $scope.login = function(username, password) {
                if (username !== '' && password !== '') {
                    authService.login(username, password)
                    .then(resp => {
                        $location.path('/dashboard');
                    })
                    .catch(e => {
                        if(e.status === 401) {
                            alert('invalid credentials');
                        } else {
                            alert('internal server error! Please try again');
                        }
                    });
                }
            };
            $scope.signup = function(username, password) {
                if (username !== '' && password !== '') {
                    authService.signup(username, password)
                    .then(resp => {
                        alert('successfully signed up please login')
                        $location.path('/dashboard');
                    })
                    .catch(e => {
                        alert(e);
                    });
                }
            }
        }
    ]);