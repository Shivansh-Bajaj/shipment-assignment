'use strict';

var myModule = angular.module('myApp.answerService', []);
myModule.factory('answerService', function($q, $http, $window) {
    return {
        add: function (body, question) {
            return $http({
                method: 'POST',
                url: '/api/v1/user/question/answer',
                header: {
                    'content-type': 'application/json'
                },
                data: {body, question}
            })
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.data;                
                } else {
                    throw 'fail to add question';
                }
            });
        },
        upvote: function (answer) {
          return $http({
              method: 'POST',
              url: '/api/v1/user/question/answer/upvote',
              header: {
                  'content-type': 'application/json'
              },
              data: {answer}
          })
          .then((resp) => {
              if (resp.status === 200) {
                  return resp.data;                
              } else {
                  throw 'fail to add question';
              }
          });
      },
      downvote: function (answer) {
        return $http({
            method: 'POST',
            url: '/api/v1/user/question/downvote',
            header: {
                'content-type': 'application/json'
            },
            data: {answer}
        })
        .then((resp) => {
            if (resp.status === 200) {
                return resp.data;                
            } else {
                throw 'fail to add question';
            }
        });
    },
        // fetchAll: function () {
        //     return $http({
        //         method: 'GET',
        //         url: '/api/v1/user/questions/',
        //         header: {
        //             'content-type': 'application/json'
        //         }
        //     })
        //     .then((resp) => {
        //       if (resp.status === 200) {
        //         return resp.data;                
        //       } else {
        //         throw 'fail to fetch questions';
        //       } 
        //     });
        // },
        fetch: function (id) {
          return $http({
              method: 'GET',
              url: '/api/v1/user/question/answer',
              header: {
                  'content-type': 'application/json'
              },
              params: {question: id}
          })
          .then((resp) => {
            if (resp.status === 200) {
              return resp.data;                
            } else {
              throw 'fail to fetch question';
            } 
          });
      }
    };
});