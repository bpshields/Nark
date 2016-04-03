(function(){
  'use strict';

  angular.module('app')
        .service('tableService', [
        '$q','$http',
      tableService
  ]);

  function tableService($q,$http){
    return {
      loadAllItems : function() {
        return $q(function(resolve,reject) {
          $http({
            method: 'GET',
            url: '/api/v1/services'
          }).then(function successCallback(response) {
            resolve(response.data);
          }, function errorCallback(response) {
            reject(response);
          });
        });
      }
    };
  }
})();
