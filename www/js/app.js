// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myPage', ['ionic', 'ngSanitize', 'ngCordova', 'ionic-modal-select'])

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $logProvider, $compileProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.maxCache(0);
  var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);

  // uncomment this lines
  $logProvider.debugEnabled(false);
  $compileProvider.debugInfoEnabled(false);
  ///////////////////////////////////////////

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
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

    .state('tabs.settings.sign-out', {
      url: '/sign-out',
      views: {
        'settings-tab@tabs': {
          controller: 'SignOutCtrl'
        }
      }
    })

   $urlRouterProvider.otherwise('/sign-in');

})
// service starts
.service('sessionService', function() {
  this.user = {}
})

.service('profileService', ["$log", "$http", "$q", "sessionService", function($log, $http, $q, sessionService) {
  this.profile = {};

  this.updateProfile = function(profile) {

    $log.log("updating profile");
    $log.log(profile);
    var user = {profile: {}};
    user.username = profile.username;
    user.email = profile.email;
    user.profile.name = profile.name;
    user.profile.email2 = profile.email2;
    user.profile.phone1 = profile.phone1;
    user.profile.phone2 = profile.phone2;
    user.profile.timezone = profile.timezone;
    //Creating a deferred object
    var deferred = $q.defer();
    // set http request params
    var requestParams = {
      method: 'PATCH',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/updateProfile',
      data: {user: sessionService.user, userProfile: user}
    };
    return $http(requestParams).then(function(response){
      if(response.status == 200){
        deferred.resolve(response);
      }else{
        deferred.reject(response);
      }
      return deferred.promise;
    });

  }
}])

.service('pathwayService', function() {
  this.pathways = [];
  this.pathway = {
    session: {},
    sessions: []
  };
})

.service('coachesService', function() {
  this.coaches = [];
})

.service('authenticationService', ["sessionService", "$state", function(sessionService, $state) {
  this.checkAuthentication = function(){
    if(Object.keys(sessionService.user).length === 0 && JSON.stringify(sessionService.user) === JSON.stringify({})){
      $state.go('signin');
      return
    }
  }
}])

.service('signOutService', ["$log", "sessionService", "profileService", "pathwayService", "$state", "coachesService", function($log, sessionService, profileService, pathwayService, $state, coachesService) {
  this.signOut = function(){
    $log.log("signing out");
    sessionService.user = {};
    profileService.profile = {};
    coachesService.coaches = [];
    pathwayService.pathways = [];
    pathwayService.pathway = {
      session: {},
      sessions: []
    };
    $state.go('signin');
  }
}])

.service('signInService', ["$http", "$q", function($http, $q){
  return {
    login: function(user){
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'POST',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/sessions',
         data: {user: user}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])

.service('coachingSessionService', ["$http", "$q", "sessionService", "$stateParams", function($http, $q, sessionService, $stateParams){

  this.sendEmail = function(message, coachId){
    //Creating a deferred object
     var deferred = $q.defer();
     // set http request params
     var requestParams = {
       method: 'POST',
       url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/send_email/' + coachId,
       data: {user: sessionService.user, message: message}
     };
     return $http(requestParams).then(function(response){
       if(response.status == 200){
         deferred.resolve(response);
       }else{
         deferred.reject(response);
       }
       return deferred.promise;
     });
  }

  this.completePreWork = function(preWork){
    //Creating a deferred object
     var deferred = $q.defer();
     // set http request params
     var requestParams = {
       method: 'PATCH',
       url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/pre_works/' + preWork.id + '/is_complete/' + preWork.is_complete,
       params: {user: sessionService.user}
     };
     return $http(requestParams).then(function(response){
       if(response.status == 200){
         deferred.resolve(response);
       }else{
         deferred.reject(response);
       }
       return deferred.promise;
     });
  }

  this.deleteBooking = function(coachingSessionId){
    //Creating a deferred object
     var deferred = $q.defer();
     // set http request params
     var requestParams = {
       method: 'DELETE',
       url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/delete_booking/' + coachingSessionId,
       params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
     };
     return $http(requestParams).then(function(response){
       if(response.status == 200){
         deferred.resolve(response);
       }else{
         deferred.reject(response);
       }
       return deferred.promise;
     });
  }

  this.getAvailability = function(){
    //Creating a deferred object
     var deferred = $q.defer();
     // set http request params
     var requestParams = {
       method: 'GET',
       url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/get_availability/' + $stateParams.coachingSession + '/' + $stateParams.all_slots,
       params: {user: sessionService.user}
     };
     return $http(requestParams).then(function(response){
       if(response.status == 200){
         deferred.resolve(response);
       }else{
         deferred.reject(response);
       }
       return deferred.promise;
     });
  }

  this.bookSession = function(coachingSession, availabilitySlot){
    //Creating a deferred object
     var deferred = $q.defer();
     // set http request params
     var requestParams = {
       method: 'POST',
       url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/book_session/' + coachingSession + '/' + availabilitySlot.id,
       params: {user: sessionService.user}
     };
     return $http(requestParams).then(function(response){
       if(response.status == 200){
         deferred.resolve(response);
       }else{
         deferred.reject(response);
       }
       return deferred.promise;
     });
   }
}])

// service ends

// factory begins
.factory('pathwaysFactory', ["$log", "$http", "$q", "sessionService", function($log, $http, $q, sessionService){
  return {
    getPathways: function(){
      $log.log("in pathways factory");
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'GET',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/get_pathways',
         params: {user: sessionService.user}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])

.factory('coachesFactory', ["$log", "$http", "$q", "sessionService", function($log, $http, $q, sessionService){
  return {
    getCoaches: function(){
      $log.log("in coaches factory");
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'GET',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/coaches',
         params: {user: sessionService.user}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])

.factory('profileFactory', ["$log", "$http", "$q", "sessionService", function($log, $http, $q, sessionService){
  return {
    getProfile: function(){
      $log.log("in profile factory");
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'GET',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/profile',
         params: {user: sessionService.user}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])

.factory('coachingSessionsFactory', ["$log", "$http", "$q", "sessionService", function($log, $http, $q, sessionService){
  return {
    getCoachingSessions: function(pathwayId){
      $log.log("in coaching sessions factory");
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'GET',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/pathways',
         params: {user: sessionService.user, pathway: {id: pathwayId}}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])

.factory('materialsFactory', ["$log", "$http", "$q", "sessionService", "$stateParams", function($log, $http, $q, sessionService, $stateParams){
  return {
    getMaterials: function(){
      $log.log("in materials factory");
      //Creating a deferred object
       var deferred = $q.defer();
       // set http request params
       var requestParams = {
         method: 'GET',
         url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/materials',
         params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
       };
       return $http(requestParams).then(function(response){
         if(response.status == 200){
           deferred.resolve(response);
         }else{
           deferred.reject(response);
         }
         return deferred.promise;
       });
    }
  }
}])
// factory ends


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
// directive ends

// filter starts
.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
})
// filter ends

.controller('SignInCtrl', ["$log", "$scope", "$state", "sessionService", "pathwayService", "$cordovaInAppBrowser", "signInService", function($log, $scope, $state, sessionService, pathwayService, $cordovaInAppBrowser, signInService) {

  $scope.signIn = function(user) {
    // call ajax if user object has username and password
    if (user && user.username && user.password) {
      $scope.loading = true;
      $log.log(user);

      signInService.login(user).then(function(responseSuccess){
        // this callback will be called asynchronously
        // when the response is available
        sessionService.user.id = responseSuccess.data.user.id;
        sessionService.user.token = responseSuccess.data.user.token;
        sessionService.user.username = responseSuccess.data.user.username;
        pathwayService.pathways = responseSuccess.data.user.pathway_attributes;
        $scope.loading = false;
        $scope.status = responseSuccess.status;
        $log.log("signed in");
        $log.log(responseSuccess);
        $log.log(sessionService.user);
        $state.go('tabs.home');
      },
      function(responseError){
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.statusText = responseError.statusText;
        if (responseError.data) {
          $scope.errorMessage = responseError.data.message;
        }
        $scope.loading = false;
        $scope.status = responseError.status;
      });
    }
  };

  $scope.forgotPassword = function(){
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

    $cordovaInAppBrowser.open('http://ci-ciabos-pr-276.herokuapp.com/users/password/new', '_blank', options).then(function(event) {
      // success
      $log.log("successfully opened link");
    })
    .catch(function(event) {
      // error
      $log.log("could not open link");
    });
  }

}])

.controller('HomeTabCtrl', ["$log", "$scope", "pathwayService", "authenticationService", "sessionService", "pathwaysFactory", function($log, $scope, pathwayService, authenticationService, sessionService, pathwaysFactory) {
  // check if user is authenticated
  authenticationService.checkAuthentication();
  $log.log("in home controller");
  $log.log(pathwayService.pathways);

 // pulling down the home view refreshes the list of pathways
 // by calling this refreshPathwayList function
  var getPathwayList = function(){
    $log.log("refreshing pathways");
    $log.log(sessionService)

    pathwaysFactory.getPathways().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      pathwayService.pathways = responseSuccess.data.user.pathway_attributes;
      $scope.pathways = responseSuccess.data.user.pathway_attributes;
      $scope.status = responseSuccess.status;
      $log.log("refreshed pathways");
      $log.log(responseSuccess);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.status = responseError.status;
    });
  }

  // pathwayService is used to transfer details of a pathway
  // and list of pathways belonging to a coachee among controllers
  if(pathwayService.pathways.length == 0){
    $log.log("no pathways in pathwayService");
    $scope.loading = true;
    getPathwayList();
    $scope.loading = false;
  }else{
    $log.log("pathways exist in pathwayService");
    $scope.pathways = pathwayService.pathways
    getPathwayList();
  }

  //refreshPathwayList function ends
  $scope.refreshPathwayList = function(){
    getPathwayList();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }
}])

.controller('CoachesTabCtrl', ["$log", "$scope", "coachesFactory", "authenticationService", "coachesService", function($log, $scope, coachesFactory, authenticationService, coachesService) {
  authenticationService.checkAuthentication();
  $log.log("coaches tab");
  // getCoaches function fetches the list of coaches that have been
  // assigned to a coachee
  var getCoaches = function(){
    coachesFactory.getCoaches().then(function(responseSuccess){
    // this callback will be called asynchronously
    // when the response is available
    $log.log("success");
    $log.log(responseSuccess);
    $scope.status = responseSuccess.status;
    coachesService.coaches = responseSuccess.data.coaches;
    $scope.coaches = responseSuccess.data.coaches;
    $log.log(responseSuccess.status);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError);
      $log.log(responseError.status);
    });
  }

  // call getCoaches function if coachesService.coaches is empty
  if (coachesService.coaches.length == 0) {
    $log.log("no coaches in coachesService");
    $scope.loading = true;
    getCoaches();
    $scope.loading = false;
  }else{
    $log.log("coachesService.coaches is not empty");
    $scope.status = 200;
    $scope.coaches = coachesService.coaches;
    getCoaches();
  }

  $scope.refreshCoachesList = function(){
    getCoaches();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }
}])

.controller('SettingsTabCtrl', ["$log", "$scope", "$ionicPopup", "profileFactory", "$state", "profileService", "authenticationService", "signOutService", function($log, $scope, $ionicPopup, profileFactory, $state, profileService, authenticationService, signOutService) {
  authenticationService.checkAuthentication();
  $log.log("in settings controller")

  $scope.confirmPasswordChange = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'For security reasons, if you wish to reset your password, you will be signed out and you will receive an email with instructions on how to change it. Do you wish to proceed?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $log.log('Ok clicked');
        signOutService.signOut();
        window.open('http://ci-ciabos-pr-276.herokuapp.com/users/password/new', '_blank', 'location=yes');
      } else {
        $log.log('Cancel clicked');
      }
    });
  }

  // get profile of a coachee
  var getProfile = function(){
    profileFactory.getProfile().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $log.log("gotten profile");
      $log.log(responseSuccess);
      $scope.status = responseSuccess.status;
      profileService.profile = responseSuccess.data.profile;
      $scope.profile = responseSuccess.data.profile;
      $log.log(responseSuccess.status);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError.status);
    });
  }

  // call getProfile method if profileService.profile is empty
  if(Object.keys(profileService.profile).length === 0 && JSON.stringify(profileService.profile) === JSON.stringify({})){
    $log.log("profile service's profile is empty");
    $scope.loading = true;
    getProfile();
    $scope.loading = false;
  }else{
    $log.log("profile service's profile is not empty");
    $scope.status = 200;
    $scope.profile = profileService.profile;
    getProfile();
  }

  $scope.refreshProfile = function(){
    getProfile();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.editProfile = function() {
    profileService.profile = $scope.profile;
    $log.log("profile editing");
    $log.log(profileService);
    $state.go('tabs.settings.edit-profile');
  }

}])

.controller('EditProfileCtrl', ["$log", "$scope", "profileService", "$http", "sessionService", "authenticationService", "$cordovaCamera", "$cordovaFileTransfer", function($log, $scope, profileService, $http, sessionService, authenticationService, $cordovaCamera, $cordovaFileTransfer) {
  authenticationService.checkAuthentication();
  $log.log("edit profile ctrl");
  $log.log(profileService);

  $scope.profile = profileService.profile;

  $scope.takePhoto = function() {
    $scope.loading = true;
    document.addEventListener("deviceready", function () {
       var options = {
       fileKey: "photo",
       fileName: "profile_pic.jpeg",
       chunkedMode: false,
       mimeType: "image/jpeg",
       quality: 75,
       destinationType: Camera.DestinationType.FILE_URI,
       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
       targetWidth: 100,
       targetHeight: 100,
       popoverOptions: CameraPopoverOptions,
       saveToPhotoAlbum: false
     };
     $cordovaCamera.getPicture(options).then(function(imageData) {
       $scope.imgURI = imageData;
       $log.log("photo selected");
       $log.log(imageData);
       $log.log($scope.imgURI);
       options.params = {user: sessionService.user};
       options.fileName = $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1);
       $cordovaFileTransfer.upload('http://ci-ciabos-pr-276.herokuapp.com/api/v1/uploadPhoto', $scope.imgURI, options).then(function(result) {
         $log.log("successfully uploaded pic");
         $log.log(result.response);
         $log.log(result.response["photo_url"]);
         $log.log(result);
         if(result.response){
           $scope.profile.photo = $scope.imgURI;
           profileService.profile.photo = $scope.imgURI;
         }
         $scope.loading = false;
         $scope.uploadMessage = "Photo upload successful";
       }, function(error) {
         $log.log("upload error");
         $log.log(error);
         $scope.loading = false;
         $scope.uploadMessage = "Photo upload failed";
       });
      }, function(err) {
        // An error occured. Show a message to the user
        $log.log("error in selecting pic");
        $log.log(err);
      });
    }, false);
  };

  $scope.updateProfile = function(profile) {
    $scope.loading = true;
    profileService.updateProfile(profile).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $log.log("updated profile");
      $log.log(responseSuccess);
      if (responseSuccess.data) {
        $scope.successMessage = responseSuccess.data.message;
      }
      $scope.loading = false;
      $scope.status = responseSuccess.status;

      $log.log(responseSuccess.status);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.loading = false;
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError.status);
    });
  };

}])

.controller('PathwayDetailsCtrl', ["$log", "$scope", "$stateParams", "coachingSessionService", "pathwayService", "authenticationService", "coachingSessionsFactory", "$state", function($log, $scope, $stateParams, coachingSessionService, pathwayService, authenticationService, coachingSessionsFactory, $state) {
  authenticationService.checkAuthentication();
  $log.log("getting pathway details");
  $log.log($stateParams);
  $scope.bookingErrorMessage = false;
  // this date function creates a Date object which is used to format
  // dates in the 'templates/pathway-details.html' view related to this controller
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }

  // function to get the list of coaching sessions for a pathway
  var getPathwayDetails = function(){

    coachingSessionsFactory.getCoachingSessions($stateParams.pathwayId).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $log.log("gotten coaching sessions");
      $log.log(responseSuccess);
      if (responseSuccess.data.pathway){

        $scope.coachingSessions = responseSuccess.data.pathway.coaching_sessions;
        $scope.pathwayName = responseSuccess.data.pathway.name;
        $scope.pathwayId = responseSuccess.data.pathway.id;
      }
      if (responseSuccess.data.noProgramme){
        $scope.noProgrammeMessage = responseSuccess.data.noProgramme;
      }
      $scope.status = responseSuccess.status;
      $log.log($scope.coachingSessions);
      $log.log($scope.pathwayName);
      $log.log(responseSuccess.status);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError);
      $log.log(responseError.status);
      pathwayService.pathway.session.booked = false;
    });
  }
  // getPathwayDetails function ends

  // checks if coachee just booked a session.
  // Use details stored in pathwayService instead
  // If not true make ajax request to fetch the details
  if (pathwayService.pathway.session.booked){
    // fetch data from pathwayService
    $log.log("in if construct");
    $scope.coachingSessions = pathwayService.pathway.sessions;
    $scope.pathwayName = pathwayService.pathway.name;
    $scope.pathwayId = pathwayService.pathway.id;
    $scope.status = 200;
    pathwayService.pathway.session.booked = false;
    getPathwayDetails();
  }else {
    // fetch data from api
    $log.log("not in if construct");
    $scope.loading = true;
    getPathwayDetails();
    $scope.loading = false;
  }

  $scope.refreshCoachingSessionsList = function(){
    getPathwayDetails();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  // deleteBooking function deletes an existing booking for a coaching session
  $scope.deleteBooking = function(coachingSessionId){
    $log.log("deleting coaching session");
    $log.log(coachingSessionId);
    $scope.loading = true;
    $scope.coachingSessionId = coachingSessionId;

    coachingSessionService.deleteBooking(coachingSessionId).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $log.log("successfully deleted booking");
      $log.log(responseSuccess);
      $scope.coachingSessions = responseSuccess.data.pathway.coaching_sessions;
      $scope.pathwayName = responseSuccess.data.pathway.name;
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      $log.log($scope.coachingSessions);
      $log.log($scope.pathwayName);
      $log.log(responseSuccess.status);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $log.log("error");
      $scope.bookingErrorMessage = "Error! Could not delete booking";
      $scope.coachingSessionId = coachingSessionId;
      $scope.loading = false;
      $log.log($scope);
    });
  }
  // deleteBooking function ends here

  $scope.viewPreWorks = function(preWorks){
    $log.log(preWorks);
    pathwayService.pathway.session.preWorks = preWorks;
    $state.go('tabs.home.pathway-details.view-pre-works');
  }

  $scope.viewGroupSessionDetails = function(groupCoachingSession){
    $log.log("in group coaching session");
    $log.log(groupCoachingSession);
    pathwayService.pathway.groupCoachingSession = groupCoachingSession;
    $state.go('tabs.home.pathway-details.view-group-coaching-session-details');
  }

  $scope.viewNonBookableDetails = function(coachingSession){
    $log.log(coachingSession.nonbookable_session_details);
    pathwayService.pathway.session.nonBookableSessionDetails = coachingSession.nonbookable_session_details;
    $state.go('tabs.home.pathway-details.view-non-bookable-session-details');
  }

}])

.controller('ViewMaterialsCtrl', ["$log", "$scope", "authenticationService", "materialsFactory", function($log, $scope, authenticationService, materialsFactory) {
  authenticationService.checkAuthentication();
  $log.log("view materials");
  $scope.loading = true;
  // getMaterials functions fetches the list of materials for a coaching session
  // via an ajax get request
  var getMaterials = function(){

    materialsFactory.getMaterials().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      $scope.materials = responseSuccess.data.materials;
      if (responseSuccess.data) {
        $scope.noMaterial = responseSuccess.data.message;
      }
      $log.log("materials gotten from materials factory");
      $log.log(responseSuccess);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.loading = false;
      $scope.status = responseError.status;
      $log.log($scope);
      $log.log(responseError);
    });

  }
  // call getMaterials function
  getMaterials();

  $scope.refreshMaterialsList = function(){
    getMaterials();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }


}])

.controller('CoachAvailabilityCtrl', ["$log", "$scope", "$stateParams", "$http", "$state", "pathwayService", "authenticationService", "coachingSessionService", function($log, $scope, $stateParams, $http, $state, pathwayService, authenticationService, coachingSessionService) {
  authenticationService.checkAuthentication();
  $log.log("coach availability");
  $log.log("All slots:" + $stateParams.all_slots);
  $log.log($stateParams);
  $scope.allSlots = $stateParams.all_slots;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }
  // getAvailability function gets the schedule of a coach assigned to a coaching session
  var getAvailability = function(){
    $scope.loading = true;
    coachingSessionService.getAvailability().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $log.log("gotten availability from coaching service");
      $log.log(responseSuccess);
      $log.log(responseSuccess.data);
      $log.log($stateParams.coachingSession);
      $scope.availabilitySlots = responseSuccess.data.slots;
      $scope.coachingSession = $stateParams.coachingSession;
      $scope.status = responseSuccess.status;
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError);
    });
    $scope.loading = false;
  }
  // call getAvailability function
  getAvailability();

  $scope.refreshAvailabilityList = function(){
    getAvailability();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.bookSession = function(coachingSession, availabilitySlot) {
    $log.log(coachingSession);
    $scope.loading = true;
    $log.log(availabilitySlot.id);
    coachingSessionService.bookSession(coachingSession, availabilitySlot).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      $log.log("success from book session");
      $log.log(responseSuccess.data);
      pathwayService.pathway.session.booked = true;
      pathwayService.pathway.sessions = responseSuccess.data.pathway.coaching_sessions;
      pathwayService.pathway.name = responseSuccess.data.pathway.name;
      pathwayService.pathway.id = responseSuccess.data.pathway.id;
      $state.go('tabs.home.pathway-details');
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.loading = false;
      $scope.status = responseError.status;
      $log.log("error");
      $log.log(responseError);
    });
  }
}])

.controller('ViewPreWorksCtrl', ["$log", "$scope", "$stateParams", "pathwayService", "authenticationService", "coachingSessionService", function($log, $scope, $stateParams, pathwayService, authenticationService, coachingSessionService) {
  authenticationService.checkAuthentication();
  $log.log("pre-works");
  $scope.preWorks = pathwayService.pathway.session.preWorks;
  $log.log($scope.preWorks);
  $scope.completePreWork = function(preWork){
    $log.log(preWork);
    $scope.loading = true;
    $scope.preWorkId = preWork.id

    coachingSessionService.completePreWork(preWork).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      $scope.completionStatus = "Completion status updated";
      $log.log("pre-work completed");
      $log.log(responseSuccess);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.completionStatus = "Can't update completion status";
      $scope.statusText = responseError.statusText;
      preWork.is_complete = false;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.loading = false;
      $scope.status = responseError.status;
      $log.log($scope);
      $log.log("error: status not completed");
      $log.log(responseError);
    });
  }
}])

.controller('ViewNonBookableSessionDetailsCtrl', ["$log", "$scope", "pathwayService", "authenticationService", function($log, $scope, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  $log.log("viewing non-bookable session details");
  $log.log(pathwayService.pathway.session.nonBookableSessionDetails);
  $scope.nonBookableSessionDetails = pathwayService.pathway.session.nonBookableSessionDetails;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }
}])

.controller('ViewGroupCoachingSessionDetailsCtrl', ["$log", "$scope", "pathwayService", "authenticationService", function($log, $scope, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  $log.log("viewing group coaching session details");
  $log.log(pathwayService.pathway.groupCoachingSession);
  $scope.groupCoachingSession = pathwayService.pathway.groupCoachingSession;
}])

.controller('SendEmailCtrl', ["$log", "$scope", "$stateParams", "sessionService", "$http", "authenticationService", "coachingSessionService", function($log, $scope, $stateParams, sessionService, $http, authenticationService, coachingSessionService) {
  authenticationService.checkAuthentication();
  $log.log("send email controller");
  $log.log($stateParams.coachId);
  $scope.coachId = $stateParams.coachId;
  $scope.message = {};

  $scope.expandTextArea = function(){
  	var element = document.getElementById("message");
    $log.log("increasing");
  	element.style.height =  element.scrollHeight + "px";
  }

  $scope.sendEmail = function(message, coachId){

    if (message && message.subject && message.content) {
      $log.log("sending email");
      $log.log(message);
      $log.log(coachId);
      $scope.loading = true;

      coachingSessionService.sendEmail(message, coachId).then(function(responseSuccess){
        // this callback will be called asynchronously
        // when the response is available
        $scope.loading = false;
        $scope.status = responseSuccess.status;
        if (responseSuccess.data) {
          $scope.successMessage = responseSuccess.data.message;
        }
        $log.log("sent email");
        $log.log(responseSuccess);
      },
      function(responseError){
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.statusText = "message not sent";
        if (responseError.data) {
          $scope.errorMessage = responseError.data.message;
        }
        $scope.loading = false;
        $scope.status = responseError.status;
        $log.log(responseError);
      });
    }
  }

}])

.controller('SignOutCtrl', ["$scope", "signOutService", function($scope, signOutService) {
  signOutService.signOut();
}])
