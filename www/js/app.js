// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myPage', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })

    .state('tabs', {
      url: '/tabs',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      cache: false
    })
    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.home.pathway-details', {
      url: '/pathway-details/:id',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/pathway-details.html',
          controller: 'PathwayDetailsCtrl'
        }
      }
    })

    .state('tabs.home.pathway-details.view-materials', {
      url: '/view-materials',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/view-materials.html',
          controller: 'ViewMaterialsCtrl'
        }
      }
    })

    .state('tabs.coaches', {
      url: '/coaches',
      views: {
        'coaches-tab': {
          templateUrl: 'templates/coaches.html',
          controller: 'CoachesTabCtrl'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsTabCtrl'
        }
      }
    })
    .state('tabs.settings.edit-profile', {
      url: '/edit-profile',
      views: {
        'settings-tab@tabs': {
          templateUrl: "templates/edit-profile.html",
          controller: 'EditProfileCtrl'
        }
      }
    })

   $urlRouterProvider.otherwise('/sign-in');

})
// service starts
.service('sessionService', function() {
  this.token = "";
  this.username = "";
})

.service('pathwayService', function() {
  this.pathways = [];
})

// service ends


// directive starts
.directive("preLoader", function() {
   return {
       restrict: 'E',
       templateUrl: 'loading.html',
       replace: true
   }
})
// directive ends

.controller('SignInCtrl', ["$scope", "$state", "$http", "sessionService", "pathwayService", function($scope, $state, $http, sessionService, pathwayService) {
  $scope.signIn = function(user) {
    $scope.statusText = null;
    // call ajax if user object has username and password
    if (user && user.username && user.password) {
      $scope.loading = true;
      console.log(user);

      $http({
        method: 'POST',
        url: 'http://local.ciabos.dev/api/v1/sessions',
        data: {user: user}
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        sessionService.token = response.data.user.token;
        sessionService.username = user.username;
        pathwayService.pathways = response.data.user.pathway_attributes;
        $scope.loading = false;
        console.log(sessionService.token);
        $state.go('tabs.home');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.statusText = response.statusText;
        if (response.data) {
          $scope.errorMessage = response.data.message;
          $scope.loading = false;
        }

      });

    }

  };

}])

.controller('HomeTabCtrl', ["$scope", "pathwayService", function($scope, pathwayService) {
  $scope.pathways = pathwayService.pathways

  console.log("in home controller");
  console.log(pathwayService.pathways);
}])

.controller('CoachesTabCtrl', function() {

})

.controller('SettingsTabCtrl', ["$scope", "$ionicPopup", function($scope, $ionicPopup) {
  $scope.confirmPasswordChange = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'For security reasons, if you wish to reset your password, you will be signed out and you will receive an email with instructions on how to change it. Do you wish to proceed?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
}])

.controller('EditProfileCtrl', ["$scope", function($scope) {
  $scope.editProfile = function(user) {
    console.log('Edit Profile', user);
  };
}])

.controller('PathwayDetailsCtrl', ["$scope", "$stateParams", "sessionService", "$http", function($scope, $stateParams, sessionService, $http) {
  console.log("get pathway details");
  $scope.loading = true;

  $http({
    method: 'GET',
    url: 'http://local.ciabos.dev/api/v1/pathways',
    params: {user: {token: sessionService.token, username: sessionService.username}, pathway: {id: $stateParams.id}}
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    console.log("success");
    console.log(response);
    $scope.coachingSessions = response.data.pathway.coaching_sessions;
    $scope.pathwayName = response.data.pathway.name;
    $scope.loading = false;
    console.log($scope.coachingSessions);
    console.log($scope.pathwayName);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $scope.loading = false;
    console.log("error");
    console.log(response);
  });

}])

.controller('ViewMaterialsCtrl', ["$scope", function($scope) {

}])
