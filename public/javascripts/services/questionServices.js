'use strict';

var myModule = angular.module('myApp.questionsService', []);
myModule.factory('questionsService', function($q, $http, $window) {
    return {
        getToken: function() {
            return $window.localStorage.getItem(token);    
        },
        add: function (title, body, tags) {
            return $http({
                method: 'POST',
                url: '/api/v1/user/question/add',
                header: {
                    'content-type': 'application/json'
                },
                data: {title, body, tags}
            })
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.data;                
                } else {
                    throw 'fail to add question';
                }
            });
        },
        fetchAll: function () {
            return $http({
                method: 'GET',
                url: '/api/v1/user/questions',
                header: {
                    'content-type': 'application/json'
                }
            })
            .then((resp) => {
              if (resp.status === 200) {
                return resp.data;                
              } else {
                throw 'fail to fetch questions';
              } 
            });
        },
        fetchByTag: function (tag) {
            return $http({
                method: 'GET',
                url: '/api/v1/user/questions',
                header: {
                    'content-type': 'application/json'
                },
                param: {tag}
            })
            .then((resp) => {
              if (resp.status === 200) {
                return resp.data;                
              } else {
                throw 'fail to fetch questions';
              } 
            });
        },
        fetchTags: function () {
            return $http({
                method: 'GET',
                url: '/api/v1/user/tags',
                header: {
                    'content-type': 'application/json'
                }
            })
            .then((resp) => {
              if (resp.status === 200) {
                return resp.data;                
              } else {
                throw 'fail to fetch questions';
              } 
            });
        },
        fetch: function (id) {
          return $http({
              method: 'GET',
              url: '/api/v1/user/question',
              header: {
                  'content-type': 'application/json'
              },
              params: {id: id}
          })
          .then((resp) => {
            if (resp.status === 200) {
              return resp.data;                
            } else {
              throw 'fail to fetch question';
            } 
          });
      },
      addfav: function (question) {
        return $http({
            method: 'POST',
            url: '/api/v1/user/question/answer/addfav',
            header: {
                'content-type': 'application/json'
            },
            data: {question}
        })
        .then((resp) => {
            if (resp.status === 200) {
                return resp.data;                
            } else {
                throw 'fail to add question';
            }
        });
    },
    remfav: function (question) {
        return $http({
            method: 'POST',
            url: '/api/v1/user/question/answer/remfav',
            header: {
                'content-type': 'application/json'
            },
            data: {question}
        })
        .then((resp) => {
            if (resp.status === 200) {
                return resp.data;                
            } else {
                throw 'fail to add question';
            }
        });
    },
    checkfav: function (question) {
        return $http({
            method: 'POST',
            url: '/api/v1/user/question/answer/checkfav',
            header: {
                'content-type': 'application/json'
            },
            data: {question}
        })
        .then((resp) => {
            if (resp.status === 200) {
                return resp.data;
            } else {
                throw 'fail to add question';
            }
        });
    }
    };
});