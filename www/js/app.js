// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myPage', ['ionic', 'ngSanitize'])

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
      url: '/coach-availability/:coachingSession/:all_slots',
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

    .state('tabs.home.pathway-details.view-group-coaching-session-details', {
      url: '/view-group-coaching-session-details',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/view-group-coaching-session-details.html',
          controller: 'ViewGroupCoachingSessionDetailsCtrl'
        }
      }
    })

    .state('tabs.home.pathway-details.view-non-bookable-session-details', {
      url: '/view-non-bookable-session-details',
      views: {
        'home-tab@tabs': {
          templateUrl: 'templates/view-non-bookable-session-details.html',
          controller: 'ViewNonBookableSessionDetailsCtrl'
        }
      }
    })

    .state('tabs.home.pathway-details.view-materials', {
      url: '/view-materials/:pathwayId',
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

    .state('tabs.coaches.send-email', {
      url: '/send-email/:coachId',
      views: {
        'coaches-tab@tabs': {
          templateUrl: 'templates/send-email.html',
          controller: 'SendEmailCtrl'
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
  this.user = {}
})

.service('profileService', function() {
  this.profile = {};
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

.directive('browseTo', function ($ionicGesture) {
 return {
  restrict: 'A',
  link: function ($scope, $element, $attrs) {
   var handleTap = function (e) {
    // todo: capture Google Analytics here
    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
   };
   var tapGesture = $ionicGesture.on('tap', handleTap, $element);
   $scope.$on('$destroy', function () {
    // Clean up - unbind drag gesture handler
    $ionicGesture.off(tapGesture, 'tap', handleTap);
   });
  }
 }
})

.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, element, attrs) {
            element.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }
            });
        }
    };
})
// directive ends

// filter starts
.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
})
// filter ends

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
        sessionService.user.id = response.data.user.id;
        sessionService.user.token = response.data.user.token;
        sessionService.user.username = response.data.user.username;
        pathwayService.pathways = response.data.user.pathway_attributes;
        $scope.loading = false;
        $scope.status = response.status;
        console.log("signed in");
        console.log(response);
        console.log(sessionService.user);
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

.controller('CoachesTabCtrl', ["$scope", "$http", "sessionService", function($scope, $http, sessionService) {
  console.log("coaches tab");

  $http({
    method: 'GET',
    url: 'http://local.ciabos.dev/api/v1/coaches',
    params: {user: sessionService.user}
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    console.log("success");
    console.log(response);

    $scope.loading = false;
    $scope.status = response.status;
    $scope.coaches = response.data.coaches;
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

  });


}])

.controller('SettingsTabCtrl', ["$scope", "$ionicPopup", "sessionService", "$http", "$state", "profileService", function($scope, $ionicPopup, sessionService, $http, $state, profileService) {
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
  }


  $scope.editProfile = function(profile) {
    profileService.profile = profile;
    console.log("profile editing");
    console.log(profileService);
    $state.go('tabs.settings.edit-profile');
  }


  $scope.loading = true;
  console.log("in settings controller")
  $http({
    method: 'GET',
    url: 'http://local.ciabos.dev/api/v1/profile',
    params: {user: sessionService.user}
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    console.log("gotten profile");
    console.log(response);

    $scope.loading = false;
    $scope.status = response.status;
    $scope.profile = response.data.profile
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

    console.log(response.status);

  });

}])

.controller('EditProfileCtrl', ["$scope", "profileService", "$http", "sessionService", function($scope, profileService, $http, sessionService) {
  console.log("edit profile ctrl");
  console.log(profileService);

  $scope.profile = profileService.profile;

  $scope.files = [];

  $scope.$on("fileSelected", function (event, args) {
    $scope.$apply(function () {
      //add the file object to the scope's files collection
      $scope.files.push(args.file);
    });
  });

  $scope.save = function() {
    $scope.loading = true;
    $http({
      method: 'POST',
      url: 'http://local.ciabos.dev/api/v1/uploadPhoto',
      headers: { 'Content-Type': undefined },
      transformRequest: function (data) {
          var formData = new FormData();
          formData.append("user", angular.toJson(data.user));
          formData.append("photo", data.files[0]);
          return formData;
      },
      //Create an object that contains the model and files which will be transformed
      // in the above transformRequest method
      data: { user: sessionService.user, files: $scope.files }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("success");
      console.log(response);
      console.log($scope);
      if(response.data.photo_url){
        $scope.profile.photo = response.data.photo_url;
      }
      $scope.loading = false;
      $scope.files = [];
      $scope.status = response.status;
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
      $scope.files = [];
      console.log("error");
      console.log(response);

    });
  };

  $scope.updateProfile = function(user) {
    console.log(user);
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
    $scope.pathwayId = pathwayService.pathway.id;
    $scope.loading = false;
    $scope.status = 200;
    pathwayService.pathway.session.booked = false;
  }else {
    // fetch data from api
    console.log("not in if construct");
    $http({
      method: 'GET',
      url: 'http://local.ciabos.dev/api/v1/pathways',
      params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("success");
      console.log(response);
      if (response.data.pathway){
        $scope.coachingSessions = response.data.pathway.coaching_sessions;
        $scope.pathwayName = response.data.pathway.name;
        $scope.pathwayId = response.data.pathway.id;
      }
      if (response.data.noProgramme){
        $scope.noProgrammeMessage = response.data.noProgramme;
      }
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
    $scope.loading = true;
    $scope.coachingSessionId = coachingSessionId;
    $http({
      method: 'DELETE',
      url: 'http://local.ciabos.dev/api/v1/delete_booking/' + coachingSessionId,
      params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
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

  $scope.viewGroupSessionDetails = function(groupCoachingSession){
    console.log("in group coaching session");
    console.log(groupCoachingSession);
    pathwayService.pathway.groupCoachingSession = groupCoachingSession;
    $state.go('tabs.home.pathway-details.view-group-coaching-session-details');
  }

  $scope.viewNonBookableDetails = function(coachingSession){
    console.log(coachingSession.nonbookable_session_details);
    pathwayService.pathway.session.nonBookableSessionDetails = coachingSession.nonbookable_session_details;
    $state.go('tabs.home.pathway-details.view-non-bookable-session-details');
  }

}])

.controller('ViewMaterialsCtrl', ["$scope", "$stateParams", "$http", "sessionService", function($scope, $stateParams, $http, sessionService) {
  console.log("view materials");
  console.log($stateParams);
  $scope.loading = true;
  $http({
    method: 'GET',
    url: 'http://local.ciabos.dev/api/v1/materials',
    params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.loading = false;
    $scope.status = response.status;
    $scope.materials = response.data.materials;
    if (response.data) {
      $scope.noMaterial = response.data.message;
    }
    console.log("materials gotten");
    console.log(response);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $scope.statusText = response.statusText;
    if (response.data) {
      $scope.errorMessage = response.data.message;
    }
    $scope.loading = false;
    $scope.status = response.status;
    console.log($scope);
    console.log(response);
  });

}])

.controller('CoachAvailabilityCtrl', ["$scope", "$stateParams", "$http", "sessionService", "$state", "pathwayService", function($scope, $stateParams, $http, sessionService, $state, pathwayService) {
  console.log("coach availability");
  console.log("All slots:" + $stateParams.all_slots);
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
    url: 'http://local.ciabos.dev/api/v1/get_availability/' + $stateParams.coachingSession + '/' + $stateParams.all_slots,
    params: {user: sessionService.user}
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
      params: {user: sessionService.user}
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
      pathwayService.pathway.id = response.data.pathway.id;
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
      params: {user: sessionService.user}
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

.controller('ViewNonBookableSessionDetailsCtrl', ["$scope", "pathwayService", function($scope, pathwayService) {
  console.log("viewing non-bookable session details");
  console.log(pathwayService.pathway.session.nonBookableSessionDetails);
  $scope.nonBookableSessionDetails = pathwayService.pathway.session.nonBookableSessionDetails;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }
}])

.controller('ViewGroupCoachingSessionDetailsCtrl', ["$scope", "pathwayService", function($scope, pathwayService) {
  console.log("viewing group coaching session details");
  console.log(pathwayService.pathway.groupCoachingSession);
  $scope.groupCoachingSession = pathwayService.pathway.groupCoachingSession;
}])



.controller('SendEmailCtrl', ["$scope", "$stateParams", "sessionService", "$http", function($scope, $stateParams, sessionService, $http) {
  console.log("send email controller");
  console.log($stateParams.coachId);
  $scope.coachId = $stateParams.coachId;
  $scope.message = {};

  $scope.expandTextArea = function(){
  	var element = document.getElementById("message");
    console.log("increasing");
  	element.style.height =  element.scrollHeight + "px";
  }

  $scope.sendEmail = function(message, coachId){

    if (message && message.subject && message.content) {
      console.log("sending email");
      console.log(message);
      console.log(coachId);
      $scope.loading = true;
      $http({
        method: 'POST',
        url: 'http://local.ciabos.dev/api/v1/send_email/' + coachId,
        data: {user: sessionService.user, message: message}
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.loading = false;
        $scope.status = response.status;
        if (response.data) {
          $scope.successMessage = response.data.message;
        }
        console.log("sent email");
        console.log(response);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.statusText = "message not sent";
        if (response.data) {
          $scope.errorMessage = response.data.message;
        }
        $scope.loading = false;
        $scope.status = response.status;
        console.log(response);
      });
    }
  }

}])
