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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.maxCache(0);
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

.service('profileService', ["$http", "$q", "sessionService", function($http, $q, sessionService) {
  this.profile = {};

  this.updateProfile = function(profile) {

    console.log("updating profile");
    console.log(profile);
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

.service('authenticationService', ["sessionService", "$state", function(sessionService, $state) {
  this.checkAuthentication = function(){
    if(Object.keys(sessionService.user).length === 0 && JSON.stringify(sessionService.user) === JSON.stringify({})){
      $state.go('signin');
      return
    }
  }
}])

.service('signOutService', ["sessionService", "profileService", "pathwayService", "$state", function(sessionService, profileService, pathwayService, $state) {
  this.signOut = function(){
    console.log("signing out");
    sessionService.user = {};
    profileService.profile = {};

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

// service ends

// factory begins
.factory('pathwaysFactory', ["$http", "$q", "sessionService", function($http, $q, sessionService){
  return {
    getPathways: function(){
      console.log("in pathways factory");
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

.factory('coachesFactory', ["$http", "$q", "sessionService", function($http, $q, sessionService){
  return {
    getCoaches: function(){
      console.log("in coaches factory");
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

.factory('profileFactory', ["$http", "$q", "sessionService", function($http, $q, sessionService){
  return {
    getProfile: function(){
      console.log("in profile factory");
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

.controller('SignInCtrl', ["$scope", "$state", "sessionService", "pathwayService", "$cordovaInAppBrowser", "signInService", function($scope, $state, sessionService, pathwayService, $cordovaInAppBrowser, signInService) {

  $scope.signIn = function(user) {
    // call ajax if user object has username and password
    if (user && user.username && user.password) {
      $scope.loading = true;
      console.log(user);

      signInService.login(user).then(function(responseSuccess){
        // this callback will be called asynchronously
        // when the response is available
        sessionService.user.id = responseSuccess.data.user.id;
        sessionService.user.token = responseSuccess.data.user.token;
        sessionService.user.username = responseSuccess.data.user.username;
        pathwayService.pathways = responseSuccess.data.user.pathway_attributes;
        $scope.loading = false;
        $scope.status = responseSuccess.status;
        console.log("signed in");
        console.log(responseSuccess);
        console.log(sessionService.user);
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
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no'
    };

    $cordovaInAppBrowser.open('http://ci-ciabos-pr-276.herokuapp.com/users/password/new', '_blank', options).then(function(event) {
      // success
      console.log("successfully opened link");
    })
    .catch(function(event) {
      // error
      console.log("could not open link");
    });
  }

}])

.controller('HomeTabCtrl', ["$scope", "pathwayService", "authenticationService", "sessionService", "pathwaysFactory", function($scope, pathwayService, authenticationService, sessionService, pathwaysFactory) {
  // check if user is authenticated
  authenticationService.checkAuthentication();
  // pathwayService is used to transfer details of a pathway
  // and list of pathways belonging to a coachee among controllers
  $scope.pathways = pathwayService.pathways
  console.log("in home controller");
  console.log(pathwayService.pathways);

 // pulling down the home view refreshes the list of pathways
 // by calling this refreshPathwayList function
  $scope.refreshPathwayList = function(){
    console.log("refreshing pathways");
    console.log(sessionService)

    pathwaysFactory.getPathways().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      pathwayService.pathways = responseSuccess.data.user.pathway_attributes;
      $scope.pathways = responseSuccess.data.user.pathway_attributes;
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
      console.log("refreshed pathways");
      console.log(responseSuccess);
    },
    function(responseError){
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
      $scope.statusText = responseError.statusText;
      if (responseError.data) {
        $scope.errorMessage = responseError.data.message;
      }
      $scope.loading = false;
      $scope.status = responseError.status;
    });
  }
  //refreshPathwayList function ends
}])

.controller('CoachesTabCtrl', ["$scope", "coachesFactory", "authenticationService", function($scope, coachesFactory, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("coaches tab");
  $scope.loading = true;
  // getCoaches function fetches the list of coaches that have been
  // assigned to a coachee
  var getCoaches = function(){
    coachesFactory.getCoaches().then(function(responseSuccess){
    // this callback will be called asynchronously
    // when the response is available
    console.log("success");
    console.log(responseSuccess);
    $scope.loading = false;
    $scope.status = responseSuccess.status;
    $scope.coaches = responseSuccess.data.coaches;
    console.log(responseSuccess.status);
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
      console.log("error");
      console.log(responseError);
      console.log(responseError.status);
    });
  }

  // call getCoaches function
  getCoaches();

  $scope.refreshCoachesList = function(){
    getCoaches();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }
}])

.controller('SettingsTabCtrl', ["$scope", "$ionicPopup", "profileFactory", "$state", "profileService", "authenticationService", "signOutService", function($scope, $ionicPopup, profileFactory, $state, profileService, authenticationService, signOutService) {
  authenticationService.checkAuthentication();
  $scope.loading = true;
  console.log("in settings controller")

  $scope.confirmPasswordChange = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'For security reasons, if you wish to reset your password, you will be signed out and you will receive an email with instructions on how to change it. Do you wish to proceed?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('Ok clicked');
        signOutService.signOut();
        window.open('http://ci-ciabos-pr-276.herokuapp.com/users/password/new', '_blank', 'location=no');
      } else {
        console.log('Cancel clicked');
      }
    });
  }

  $scope.editProfile = function() {
    profileService.profile = $scope.profile;
    console.log("profile editing");
    console.log(profileService);
    $state.go('tabs.settings.edit-profile');
  }

  // get profile of a coachee
  var getProfile = function(){
    profileFactory.getProfile().then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      console.log("gotten profile");
      console.log(responseSuccess);
      $scope.loading = false;
      $scope.status = responseSuccess.status;
      $scope.profile = responseSuccess.data.profile
      console.log(responseSuccess.status);
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
      console.log("error");
      console.log(responseError.status);
    });
  }

  // call getProfile method
  getProfile();

  $scope.refreshProfile = function(){
    getProfile();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

}])

.controller('EditProfileCtrl', ["$scope", "profileService", "$http", "sessionService", "authenticationService", "$cordovaCamera", "$cordovaFileTransfer", function($scope, profileService, $http, sessionService, authenticationService, $cordovaCamera, $cordovaFileTransfer) {
  authenticationService.checkAuthentication();
  console.log("edit profile ctrl");
  console.log(profileService);

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
       console.log("photo selected");
       console.log(imageData);
       console.log($scope.imgURI);
       options.params = {user: sessionService.user};
       options.fileName = $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1);
       $cordovaFileTransfer.upload('http://ci-ciabos-pr-276.herokuapp.com/api/v1/uploadPhoto', $scope.imgURI, options).then(function(result) {
         console.log("successfully uploaded pic");
         console.log(result.response);
         console.log(result.response["photo_url"]);
         console.log(result);
         if(result.response){
           $scope.profile.photo = $scope.imgURI;
         }
         $scope.loading = false;
         $scope.uploadMessage = "Photo upload successful";
       }, function(error) {
         console.log("upload error");
         console.log(error);
         $scope.loading = false;
         $scope.uploadMessage = "Photo upload failed";
       });
      }, function(err) {
        // An error occured. Show a message to the user
        console.log("error in selecting pic");
        console.log(err);
      });
    }, false);
  };

  $scope.updateProfile = function(profile) {
    $scope.loading = true;
    profileService.updateProfile(profile).then(function(responseSuccess){
      // this callback will be called asynchronously
      // when the response is available
      console.log("updated profile");
      console.log(responseSuccess);
      if (responseSuccess.data) {
        $scope.successMessage = responseSuccess.data.message;
      }
      $scope.loading = false;
      $scope.status = responseSuccess.status;

      console.log(responseSuccess.status);
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
      console.log("error");
      console.log(responseError.status);
    });
  };

}])

.controller('PathwayDetailsCtrl', ["$scope", "$stateParams", "sessionService", "$http", "$state", "pathwayService", "authenticationService", function($scope, $stateParams, sessionService, $http, $state, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("getting pathway details");
  console.log($stateParams);
  $scope.loading = true;
  $scope.bookingErrorMessage = false;
  // this date function creates a Date object which is used to format
  // dates in the 'templates/pathway-details.html' view related to this controller
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }

  // function to get the list of coaching sessions for a pathway
  var getPathwayDetails = function(){
    $http({
      method: 'GET',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/pathways',
      params: {user: sessionService.user, pathway: {id: $stateParams.pathwayId}}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("gotten coaching sessions");
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
  // getPathwayDetails function ends

  // checks if coachee just booked a session. If true don't make ajax request
  // Use details stored in pathwayService instead
  // If not true make ajax request to fetch the details
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
    getPathwayDetails();
  }

  $scope.refreshCoachingSessionsList = function(){
    getPathwayDetails();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  // deleteBooking function deletes an existing booking for a coaching session
  $scope.deleteBooking = function(coachingSessionId){
    console.log("deleting coaching session");
    console.log(coachingSessionId);
    $scope.loading = true;
    $scope.coachingSessionId = coachingSessionId;
    $http({
      method: 'DELETE',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/delete_booking/' + coachingSessionId,
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
  // deleteBooking function ends here

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

.controller('ViewMaterialsCtrl', ["$scope", "$stateParams", "$http", "sessionService", "authenticationService", function($scope, $stateParams, $http, sessionService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("view materials");
  console.log($stateParams);
  $scope.loading = true;
  // getMaterials functions fetches the list of materials for a coaching session
  // via an ajax get request
  var getMaterials = function(){
    $http({
      method: 'GET',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/materials',
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
  }
  // call getMaterials function
  getMaterials();

  $scope.refreshMaterialsList = function(){
    getMaterials();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }


}])

.controller('CoachAvailabilityCtrl', ["$scope", "$stateParams", "$http", "sessionService", "$state", "pathwayService", "authenticationService", function($scope, $stateParams, $http, sessionService, $state, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("coach availability");
  console.log("All slots:" + $stateParams.all_slots);
  console.log($stateParams);
  console.log(sessionService);
  $scope.loading = true;
  $scope.allSlots = $stateParams.all_slots;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }
  // getAvailability function gets the schedule of a coach assigned to a coaching session
  var getAvailability = function(){
    $http({
      method: 'GET',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/get_availability/' + $stateParams.coachingSession + '/' + $stateParams.all_slots,
      params: {user: sessionService.user}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("gotten availability");
      console.log(response);
      console.log(response.data.slots);
      $scope.availabilitySlots = response.data.slots;
      $scope.coachingSession = $stateParams.coachingSession;
      $scope.loading = false;
      $scope.status = response.status;
      console.log("gotten availability");
      console.log(response);
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
  }
  // call getAvailability function
  getAvailability();

  $scope.refreshAvailabilityList = function(){
    getAvailability();
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.bookSession = function(coachingSession, availabilitySlot) {
    console.log(coachingSession);
    console.log(availabilitySlot.id);

    $http({
      method: 'POST',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/book_session/' + coachingSession + '/' + availabilitySlot.id,
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

.controller('ViewPreWorksCtrl', ["$scope", "$stateParams", "$http", "pathwayService", "sessionService", "authenticationService", function($scope, $stateParams, $http, pathwayService, sessionService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("pre-works");
  $scope.preWorks = pathwayService.pathway.session.preWorks;
  console.log($scope.preWorks);
  $scope.completePreWork = function(preWork){
    console.log(preWork);
    $scope.loading = true;
    $scope.preWorkId = preWork.id
    $http({
      method: 'PATCH',
      url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/pre_works/' + preWork.id + '/is_complete/' + preWork.is_complete,
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

.controller('ViewNonBookableSessionDetailsCtrl', ["$scope", "pathwayService", "authenticationService", function($scope, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("viewing non-bookable session details");
  console.log(pathwayService.pathway.session.nonBookableSessionDetails);
  $scope.nonBookableSessionDetails = pathwayService.pathway.session.nonBookableSessionDetails;
  $scope.date = function(d){
    var date = new Date(d);
    return date;
  }
}])

.controller('ViewGroupCoachingSessionDetailsCtrl', ["$scope", "pathwayService", "authenticationService", function($scope, pathwayService, authenticationService) {
  authenticationService.checkAuthentication();
  console.log("viewing group coaching session details");
  console.log(pathwayService.pathway.groupCoachingSession);
  $scope.groupCoachingSession = pathwayService.pathway.groupCoachingSession;
}])

.controller('SendEmailCtrl', ["$scope", "$stateParams", "sessionService", "$http", "authenticationService", function($scope, $stateParams, sessionService, $http, authenticationService) {
  authenticationService.checkAuthentication();
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
        url: 'http://ci-ciabos-pr-276.herokuapp.com/api/v1/send_email/' + coachId,
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

.controller('SignOutCtrl', ["$scope", "signOutService", function($scope, signOutService) {
  signOutService.signOut();
}])
