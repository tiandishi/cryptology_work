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



    $scope.aesss = function () {

        var aa = $scope.init_code || "shisi";
        var bb = $scope.secret_code || "mima";
        var cc = $scope.length_code || 128;

        var test = new AES.Crypto(bb);//已My Password为密钥建立一个新的AES.Crypto对象.
        $scope.aes_code = test.encrypt(aa);//返回一个16进制字符串,为使用相应密钥加密字符串123的结果
    }
});

encrypt.controller('aes_decrypt', function ($scope, $location) {
    //
    $scope.aesss = function () {
        var aa = $scope.init_code || "shisi";
        var bb = $scope.secret_code || "mima";
        var cc = $scope.length_code || 128;

        var test = new AES.Crypto(bb);//已My Password为密钥建立一个新的AES.Crypto对象.
        $scope.aes_code = test.decrypt(aa);//返回一个16进制字符串,为使用相应密钥加密字符串123的结果

    }
});
