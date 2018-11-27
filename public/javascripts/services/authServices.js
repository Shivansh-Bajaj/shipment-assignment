'use strict';

var myModule = angular.module('myApp.authService', []);
myModule.factory('authService', function($q, $http, $window) {
    return {
        getToken: function() {
            return $window.localStorage.getItem(token);    
        },
        login: function (username, password) {
            return $http({
                method: 'POST',
                url: '/api/v1/auth/login',
                header: {
                    'content-type': 'application/json'
                },
                data: {username, password}
            })
            .then((resp) => {
                if (resp.status === 200) {
                    $window.localStorage.setItem('token', resp.data.token);
                    return resp;                
                } else {
                    throw 'fail to login';
                }
            });
        },
        signup: function (username, password) {
            return $http({
                method: 'POST',
                url: '/api/v1/auth/signup',
                header: {
                    'content-type': 'application/json'
                },
                data: {username, password}
            });
        },
        getUser: function (id) {
            return $http({
                method: 'GET',
                url: '/api/v1/user',
                header: {
                    'content-type': 'application/json'
                },
                params: {id}
            });
        }
    };
});