'use strict';

/**
 * @ngdoc overview
 * @name sampleAngularApp
 * @description
 * # sampleAngularApp
 *
 * Main module of the application.
 */
var samplejs = angular.module('sampleAngularApp', [
    //'ngAnimate',
    //'ngCookies',
    //'ngResource',
    'ngRoute',
    //'ngSanitize',
    'ngTouch',
    'satellizer'
  ]);
samplejs.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
        .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpcontroller',
        controllerAs: 'signup'
      })
        .when('/restricted', {
        templateUrl: 'views/restricted.html',
        controller: 'RestrictedCtrl',
        controllerAs: 'restricted',
        data:{ 
          requiredLogin:true
        }
      })

      .otherwise({
        redirectTo: '/'
      });
  });

samplejs.config(function($authProvider){
  $authProvider.baseUrl = 'http://127.0.0.1:8000/api/rest-auth';
  $authProvider.loginUrl = '/login/';
  $authProvider.signupUrl = '/registration/';
  $authProvider.tokenName= "key";
  $authProvider.authToken = "Token ";
  //$authProvider.withCredentials = true;

});

samplejs.run(function ($rootScope, $route, $location, $auth) {
  $rootScope.$on('$routeChangeStart',
    function (event, toState) {
      var requiredLogin = false;
      // check if this state need login
      if (toState.data && toState.data.requiredLogin)
        requiredLogin = true;
      
      // if yes and if this user is not logged in, redirect him to login page
      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $location.path('/login/');
      }
    });
});

var MainCtrl = function($location, $scope , $http){

  $scope.go_restricted = function(){
    $location.path('/restricted')

  }
  $scope.go_login = function(){
    $location.path('/login')

  };
  $scope.go_signup = function(){
    $location.path('/signup')
  }

  $http.get("http://127.0.0.1:8000/api/").then(function(res){
    $scope.data_results = res.data;
})

}
var RestrictedCtrl = function($scope, $http,$window, $rootScope){
  $http.get("http://127.0.0.1:8000/api/owner/").then(function(res){
    $scope.data_results = res.data;
  })
 

};

var RestrictedService = function(){

};

var LoginCtrl = function($auth, $http,$location, $scope, $rootScope,$window){
  //do_check();
  $scope.error_messages = "Username and password did not match";
  $scope.show_error = false;
  $scope.show_login = true;
  $scope.do_login = function(data){
    do_login_op(data);
  }

  var do_login_op = function(data){
    var send_data = {
    username:data.username,
    password:data.password
    }
 
    $auth.login(send_data).then(function(response){

      console.log(response);
      $auth.setToken(response);
      $rootScope.authenticated = true;

      $http.get('http://127.0.0.1:8000/api/rest-auth/user/')
      
      .then(function(res){

          var user = JSON.stringify(res.data);

          $window.localStorage.setItem('user', user);
          $rootScope.currentUser = res.data.username;


       })

       .catch(function(err){
        console.log(err);
       })

      
      $location.path('/restricted');

    }).catch(function(err){
      console.error(err);
      $scope.show_error = true;
    })
  }

var do_check = function(){
  var auth_status = $auth.isAuthenticated();
  if(auth_status){
    $scope.show_login = false;
  }
  else{$scope.show_login=true;}
}

  $scope.do_signout =function(){
    console.log('doing signout')
    $auth.logout();
    localStorage.removeItem('user');
    do_check();
    
  }

  do_check();



};



var SignUpcontroller = function($auth, $location, $scope, $rootScope,$window, $http){
  var do_login_op = function(data){
    var send_data = {
    username:data.username,
    password:data.password
    }
 
    $auth.login(send_data).then(function(response){

      console.log(response);
      $auth.setToken(response);
      $rootScope.authenticated = true;

      $http.get('http://127.0.0.1:8000/api/rest-auth/user/')
      
      .then(function(res){

          var user = JSON.stringify(res.data);

          $window.localStorage.setItem('user', user);
          $rootScope.currentUser = res.data.username;


       })

       .catch(function(err){
        console.log(err);
       })

      
      $location.path('/restricted');

    }).catch(function(err){
      console.error(err);
      $scope.show_error = true;
    })
  }
  $scope.do_signup = function(info){
    var send_data = { username: info.username,
                  password1:info.password1,
                  password2:info.password2,
                  email : info.email
    }

    $auth.signup(send_data).then(function(res){
      console.log("signup success");
      info = {username:send_data.username,password:send_data.password1}
      do_login_op(info);
      }).catch(function(err){
        console.log(err)
        $scope.errors = err.data;
        $scope.show_error = true;
      })
      }


};



var HomeController = function(){

};
var HomeService = function(){

};

samplejs.controller('MainCtrl', MainCtrl);
samplejs.controller('LoginCtrl', LoginCtrl);
samplejs.controller('SignUpcontroller', SignUpcontroller);
samplejs.controller('HomeController', HomeController);
samplejs.controller('RestrictedCtrl', RestrictedCtrl);


samplejs.factory('RestrictedService', RestrictedService);
//samplejs.factory('LoginService', LoginService);
//samplejs.factory('SignUpService', SignUpService);
samplejs.factory('HomeService', HomeService);