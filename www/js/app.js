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

.config(function($stateProvider, $urlRouterProvider) {

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
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
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
    .state('tabs.coaches', {
      url: '/coaches',
      views: {
        'coaches-tab': {
          templateUrl: 'templates/coaches.html',
          controller: 'CoachesTabCtrl'
        }
      }
    })
    .state('tabs.schedule', {
      url: '/schedule',
      views: {
        'schedule-tab': {
          templateUrl: 'templates/schedule.html',
          controller: 'ScheduleTabCtrl'
        }
      }
    })
    // .state('tabs.contact', {
    //   url: '/contact',
    //   views: {
    //     'contact-tab': {
    //       templateUrl: 'templates/contact.html'
    //     }
    //   }
    // });


   $urlRouterProvider.otherwise('/sign-in');

})

.controller('SignInCtrl', function($scope, $state) {

  $scope.signIn = function(user) {
    console.log('Sign-In', user);
    $state.go('tabs.home');
  };

})

.controller('HomeTabCtrl', function() {

})

.controller('CoachesTabCtrl', function() {

})

.controller('ScheduleTabCtrl', function() {

})
