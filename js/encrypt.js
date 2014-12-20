'use strict';

var encrypt = angular.module('encrypt', ['ui.bootstrap', 'ngRoute']);

encrypt.service('imgdata', ['$rootScope', function ($rootScope) {
    }]);

encrypt.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider
                .when('/', {controller: 'DemoCtrl'})
                .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);

encrypt.controller('aes_encrypt', function ($scope, $location) {
    alert("as");
    $scope.aesss=function(){
    var aa= $scope.init_code||"shisi";
    var bb=$scope.secret_code||"mima";
    var cc=$scope.length_code||128;
    var encrypted = Aes.Ctr.encrypt(aa, bb,cc);
    $scope.aes_code=encrypted;
    
    }
});

encrypt.controller('aes_decrypt', function ($scope, $location) {
    //
    $scope.aesss=function(){
    var aa= $scope.init_code||"shisi";
    var bb=$scope.secret_code||"mima";
    var cc=$scope.length_code||128;
    var encrypted = Aes.Ctr.decrypt(aa, bb,cc);
    $scope.aes_code=encrypted;
   
    }
});
