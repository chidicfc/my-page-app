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
  $ionicConfigProvider.views.maxCache(0);
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
    .state('tabs.home.pathway-details', {
      url: '/pathway-details/:pathwayId',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/pathway-details.html',
          controller: 'PathwayDetailsCtrl'
        }
      }
    })

    .state('tabs.home.pathway-details.coach-availability', {
      url: '/coach-availability/:coachingSession',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/coach-availability.html',
          controller: 'CoachAvailabilityCtrl'
        }
      }
    })

    .state('tabs.home.pathway-details.view-pre-works', {
      url: '/view-pre-works',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/view-pre-works.html',
          controller: 'ViewPreWorksCtrl'
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
  this.pathway = {
    session: {},
    sessions: []
  };
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

.directive("errorMessage", function() {
   return {
       restrict: 'E',
       templateUrl: 'error_message.html',
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
        $scope.status = response.status;
        console.log(sessionService.token);
        $state.go('tabs.home');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.statusText = response.statusText;
        if (response.data) {
          $scope.errorMessage = response.data.message;
        }
        $scope.loading = false;
        $scope.status = response.status;
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

.controller('PathwayDetailsCtrl', ["$scope", "$stateParams", "sessionService", "$http", "$state", "pathwayService", function($scope, $stateParams, sessionService, $http, $state, pathwayService) {
  console.log("get pathway details");
  $scope.loading = true;
  $scope.bookingErrorMessage = false;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }

  if (pathwayService.pathway.session.booked){
    // fetch data from pathwayService
    console.log("in if construct");
    $scope.coachingSessions = pathwayService.pathway.sessions;
    $scope.pathwayName = pathwayService.pathway.name;
    $scope.loading = false;
    $scope.status = 200;
    pathwayService.pathway.session.booked = false;
  }else {
    // fetch data from api
    console.log("not in if construct");
    $http({
      method: 'GET',
      url: 'http://local.ciabos.dev/api/v1/pathways',
      params: {user: {token: sessionService.token, username: sessionService.username}, pathway: {id: $stateParams.pathwayId}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("success");
      console.log(response);
      $scope.coachingSessions = response.data.pathway.coaching_sessions;
      $scope.pathwayName = response.data.pathway.name;
      $scope.loading = false;
      $scope.status = response.status;
      console.log($scope.coachingSessions);
      console.log($scope.pathwayName);
      console.log(response.status);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = response.statusText;
      if (response.data) {
        $scope.errorMessage = response.data.message;
      }
      $scope.loading = false;
      $scope.status = response.status;
      console.log("error");
      console.log(response);
      console.log(response.status);
      pathwayService.pathway.session.booked = false;
    });
  }

  $scope.deleteBooking = function(coachingSessionId){
    console.log("deleting coaching session");
    console.log(coachingSessionId);

    $http({
      method: 'DELETE',
      url: 'http://local.ciabos.dev/api/v1/delete_booking/' + coachingSessionId,
      params: {user: {token: sessionService.token, username: sessionService.username}, pathway: {id: $stateParams.pathwayId}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("success");
      console.log(response);
      $scope.coachingSessions = response.data.pathway.coaching_sessions;
      $scope.pathwayName = response.data.pathway.name;
      $scope.loading = false;
      $scope.status = response.status;
      console.log($scope.coachingSessions);
      console.log($scope.pathwayName);
      console.log(response.status);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("error");
      $scope.bookingErrorMessage = "Error! Could not delete booking";
      $scope.coachingSessionId = coachingSessionId;
      $scope.loading = false;
      console.log($scope);
      //$scope.coachingSessions = response.data.pathway.coaching_sessions;
      //$scope.pathwayName = response.data.pathway.name;
    });



  }

  $scope.viewPreWorks = function(preWorks){
    console.log(preWorks);
    pathwayService.pathway.session.preWorks = preWorks;
    $state.go('tabs.home.pathway-details.view-pre-works');
  }

}])

.controller('ViewMaterialsCtrl', ["$scope", function($scope) {

}])

.controller('CoachAvailabilityCtrl', ["$scope", "$stateParams", "$http", "sessionService", "$state", "pathwayService", function($scope, $stateParams, $http, sessionService, $state, pathwayService) {
  console.log("coach availability");
  console.log($stateParams);
  console.log(sessionService);
  $scope.loading = true;

  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }

  $scope.dateHours = function(d){
    var date = new Date(d);
    var hours = date.getHours();
    return ("0" + hours).slice(-2);
  }

  $scope.dateMins = function(d){
    var date = new Date(d);
    var mins = date.getMinutes();
    return ("0" + mins).slice(-2);
  }

  $http({
    method: 'GET',
    url: 'http://local.ciabos.dev/api/v1/get_availability/' + $stateParams.coachingSession,
    params: {user: {token: sessionService.token, username: sessionService.username}}
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.availabilitySlots = response.data;
    $scope.coachingSession = $stateParams.coachingSession;
    $scope.loading = false;
    $scope.status = response.status;
    console.log("success");
    console.log(response.data);
    console.log($stateParams.coachingSession);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $scope.statusText = response.statusText;
    if (response.data) {
      $scope.errorMessage = response.data.message;
    }
    $scope.loading = false;
    $scope.status = response.status;
    console.log("error");
    console.log(response);
  });

  $scope.bookSession = function(coachingSession, availabilitySlot) {
    console.log(coachingSession);
    console.log(availabilitySlot.id);

    $http({
      method: 'POST',
      url: 'http://local.ciabos.dev/api/v1/book_session/' + coachingSession + '/' + availabilitySlot.id,
      params: {user: {token: sessionService.token, username: sessionService.username}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.loading = false;
      $scope.status = response.status;
      console.log("success from book session");
      console.log(response.data);
      pathwayService.pathway.session.booked = true;
      pathwayService.pathway.sessions = response.data.pathway.coaching_sessions;
      pathwayService.pathway.name = response.data.pathway.name;
      $state.go('tabs.home.pathway-details');
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = response.statusText;
      if (response.data) {
        $scope.errorMessage = response.data.message;
      }
      $scope.loading = false;
      $scope.status = response.status;
      console.log("error");
      console.log(response);
    });
  }

}])

.controller('ViewPreWorksCtrl', ["$scope", "$stateParams", "$http", "pathwayService", "sessionService", function($scope, $stateParams, $http, pathwayService, sessionService) {
  console.log("pre-works");
  $scope.preWorks = pathwayService.pathway.session.preWorks;
  console.log($scope.preWorks);
  $scope.completePreWork = function(preWork){
    console.log(preWork);
    $scope.loading = true;
    $scope.preWorkId = preWork.id
    $http({
      method: 'PATCH',
      url: 'http://local.ciabos.dev/api/v1/pre_works/' + preWork.id + '/is_complete/' + preWork.is_complete,
      params: {user: {token: sessionService.token, username: sessionService.username}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.loading = false;
      $scope.status = response.status;
      $scope.completionStatus = "Completion status updated";
      console.log("pre-work completed");
      console.log(response);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.completionStatus = "Can't update completion status";
      $scope.statusText = response.statusText;
      preWork.is_complete = false;
      $scope
      if (response.data) {
        $scope.errorMessage = response.data.message;
      }
      $scope.loading = false;
      $scope.status = response.status;
      console.log($scope);
      console.log("error: status not completed");
      console.log(response);
    });

  }
}])
