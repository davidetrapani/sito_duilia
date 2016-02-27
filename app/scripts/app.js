'use strict';

/**
 * @ngdoc overview
 * @name webprojectsApp
 * @description
 * # webprojectsApp
 *
 * Main module of the application.
 */
angular
  .module('website', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'website.config',
    'bootstrapLightbox',
    //'wu.masonry',
    'iso.directives',
    'uiGmapgoogle-maps',
    'ui.validate',
    'oitozero.ngSweetAlert',
    'matchMedia'
  ])
  .run(run)
  .config(config)
  .controller('HomeCtrl', homeCtrl)
  .controller('MainCtrl', mainCtrl)
  .controller('AboutCtrl', aboutCtrl)

  .controller('ProjectCtrl', projectCtrl)
  .controller('ProjectsCtrl', projectsCtrl)

  .controller('ContactsCtrl', contactsCtrl)

  .controller('LightBoxCtrl', lightBoxCtrl)

  .directive('sidebar', sidebar)
  .directive('includeReplace', includeReplace)
  .directive('responsiveHeightToParent', responsiveHeightToParent)
  .directive('imagesLoaded', imagesLoaded)
  .directive('previewImage', previewImage)
  //  .directive('rightClickDisable', rightClickDisable)
  .filter('htmlToPlaintext', htmlToPlaintext)

  .factory('DataHubSrvc', dataHubSrvc);
;


function run($rootScope, $window,  $location) {

  //http://stackoverflow.com/questions/21711939/cant-figure-out-why-page-loads-at-bottom-angular-ui-router-autoscroll-issue
  $rootScope.$on('$viewContentLoaded', function(){
    var interval = setInterval(function(){
      if (document.readyState == "complete") {
        window.scrollTo(0, 0);
        clearInterval(interval);
      }
    },200);
  });

  $rootScope.$on('$routeChangeStart', function (evt, absNewUrl, absOldUrl) {
    $window.scrollTo(0, 0);    //scroll to top of page after each route change
  });
}
function config($stateProvider, $urlRouterProvider, LightboxProvider) {

  LightboxProvider.templateUrl = 'views/templates/lightbox/lightbox-template.html';

  // ROUTING /////////////////////////////
  $urlRouterProvider.otherwise('/site/home');
  $stateProvider
    .state('site', {
      abstract: true,
      url: '/site',
      templateUrl: 'views/templates/site/content.html',
      controller: 'MainCtrl'

    })
    .state('site.home', {
      url: '/home',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .state('site.contacts', {
      url: '/contacts',
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl'
    })
    .state('site.project', {
      url: '/project/:projectId',
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl'
    })
    .state('site.projects', {
      url: '/projects',
      templateUrl: 'views/projects.html',
      controller: 'ProjectsCtrl'
    })
    .state('site.about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .state('site.empty', {
      url: '/empty',
      templateUrl: 'views/empty.html',
      controller: 'AboutCtrl'
    })

  ;
}

/////////////// CONTROLLERS ////////////////
function homeCtrl($scope,$q, $timeout, DataHubSrvc, $sce){
  $scope.showColor = [];
  $scope.selected=-1;
  $scope.setSelected = function(value){
    $scope.selected=value;
  }

  $scope.projects =[];
  var project_types = [];
  $scope.project_types = [];

  DataHubSrvc.getView('homepage').then(function(data){
    $scope.homeContent = $sce.trustAsHtml(data[0].body[0].value);
    DataHubSrvc.getView('projects').then(function(projects){
    for(var i = 0; i<projects.length; i++){
      var types = '';
      if(projects[i].field_project_types){
        for(var j = 0; j<projects[i].field_project_types.length; j++){
          if(projects[i].field_project_types[j])
            types += projects[i].field_project_types[j].target_id + ' ';
        }
        projects[i].class=types;
      }
    }
    $scope.projects = projects;
    console.log($scope.projects);
    DataHubSrvc.getProjectTypes(projects).then(function(data){
      $scope.project_types =data;
    });
  });
  });

  $scope.$on('imagesLoaded', function(){
  });


}
function contactsCtrl($scope, $rootScope, $q, $timeout, DataHubSrvc, SweetAlert, $sce){
  $scope.generalInfo = $rootScope.generalInfo;
  $scope.submitForm = function(){
    //action="http://www.merakistudio.it/webform/webform.php"
    $scope.data = {
      name: $scope.name,
      email: $scope.email,
      subject: $scope.subject,
      comments: $scope.comments
    };

    DataHubSrvc.sendWebFormData($scope.data).then(function(data){
      SweetAlert.swal(
        { title: "Grazie per averci contattato!",
          text: "Sarà nostra premura rispondervi nel più breve tempo possibile.",
          confirmButtonColor: "#ffffff"
        });
      }, function(data){
      SweetAlert.swal(
      { title: "Errore nell'invio",
        text: "",
        confirmButtonColor: "#ffffff"
      }

      );
    });
  }

  DataHubSrvc.getView('contacts_page').then(function(data){
    $scope.contact_page = data[0];
    console.log(data);
    if(data[0].body[0])
      $scope.pageContent = $sce.trustAsHtml(data[0].body[0].value);
  });



  $scope.$watch(function(){return $rootScope.generalInfo;},function(newVal, oldVal){
    if(newVal ){
      $scope.generalInfo = newVal;
      var lat = parseFloat(newVal.field_latitudine[0].value);
      var long = parseFloat(newVal.field_longitudine[0].value);
      var zoom = parseFloat(newVal.field_scala[0].value);

      //var lat = 44;
      //var long = 11;
      //var zoom = 8;
      $scope.map = { center: { latitude: lat, longitude:  long }, zoom: zoom };
      $scope.marker = { coords: { latitude: lat, longitude:  long }, id: 1 };

      //https://snazzymaps.com/style/15/subtle-grayscale
      var styleArray =

        //[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
        [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

      $scope.mapOptions = {
        styles: styleArray
      };

      console.log($scope.map);
      google.maps.event.trigger($scope.map, 'resize');
    }
  });
}
function mainCtrl($scope, $rootScope, $q, $timeout, DataHubSrvc){
  DataHubSrvc.getView('info').then(function(info){
    $rootScope.generalInfo = info[0];
    $scope.generalInfo = info[0];
    console.log('$scope.generalInfo', $scope.generalInfo);
  });
}
function projectCtrl($scope, $stateParams, $sce, DataHubSrvc, Lightbox){
  $scope.found = true;

  DataHubSrvc.getNode($stateParams.projectId).then(function(data){
    $scope.project = data;
    $scope.project.content = ($scope.project.body[0])?$sce.trustAsHtml($scope.project.body[0].value):'';
    $scope.project.contentExtra =  ($scope.project.field_project_extra[0])?$sce.trustAsHtml($scope.project.field_project_extra[0].value):'';
  }, function(status){
    if(status==404)
      $scope.found = false;
  });

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.project.field_project_images, index);
  };

  DataHubSrvc.getView('projects').then(function(projects){
    for(var i = 0; i<projects.length; i++){
      var types = '';
      if(projects[i].field_project_types){
        for(var j = 0; j<projects[i].field_project_types.length; j++){
          if(projects[i].field_project_types[j])
            types += projects[i].field_project_types[j].target_id + ' ';
        }
        projects[i].class=types;
      }
    }
    $scope.projects = projects;
    DataHubSrvc.getProjectTypes(projects).then(function(data){
      $scope.project_types =data;
    });
  });

}
function projectsCtrl($scope, $stateParams, $sce, DataHubSrvc, Lightbox){
  $scope.selected=-1;
  $scope.setSelected = function(value){
    console.log(value);
    $scope.selected=value;
  }

  $scope.projects =[];
  var project_types = [];
  $scope.project_types = [];

  DataHubSrvc.getView('projects_page').then(function(data){
    $scope.projects_page = data;
    if(data[0].body[0])
     $scope.pageContent = $sce.trustAsHtml(data[0].body[0].value);
    DataHubSrvc.getView('projects').then(function(projects){
      for(var i = 0; i<projects.length; i++){
        var types = '';
        if(projects[i].field_project_types){
          for(var j = 0; j<projects[i].field_project_types.length; j++){
            if(projects[i].field_project_types[j])
              types += projects[i].field_project_types[j].target_id + ' ';
          }
          projects[i].class=types;
        }
      }
      $scope.projects = projects;
      console.log($scope.projects);
      DataHubSrvc.getProjectTypes(projects).then(function(data){
        $scope.project_types =data;
      });
    });
  });
}
function aboutCtrl($scope, $stateParams, $sce, DataHubSrvc, Lightbox){
  $scope.selected=-1;
  $scope.setSelected = function(value){
    console.log(value);
    $scope.selected=value;
  }

  $scope.projects =[];
  var project_types = [];
  $scope.project_types = [];

  DataHubSrvc.getView('about_page').then(function(data){
    $scope.about_page = data;
    if(data[0].body[0])
      $scope.pageContent = $sce.trustAsHtml(data[0].body[0].value);
    DataHubSrvc.getView('team-members').then(function(team_members){
      $scope.team_members = team_members;
      console.log(team_members);
    });
  });
}
function lightBoxCtrl($scope, $window, Lightbox) {
  $scope.close = function(res){
    Lightbox.closeModal(res);
  }
}
/////////////// CONTROLLERS ////////////////

/////////////// DIRECTIVES ////////////////
function sidebar($rootScope, $timeout, screenSize) {
  return {
    restrict: 'A',
    controller: function ($scope, $element) {

      if (screenSize.is('xs, sm'))
        $scope.left = -370;
      else
        $scope.left = -440;

        $scope.open = function () {
        if( $(".main-navigation").hasClass('menu-opened')) {
          $(".main-navigation a.close").trigger('click');
          return false;
        }
        $(".main-navigation").animate({left: "0"},
          {
            complete: function(){
              $(".main-navigation").addClass('menu-opened');
            }
          });
      }
      $scope.close = function () {
        $(".main-navigation").animate({left: $scope.left + "px"},
          {
            complete: function(){
              $(".main-navigation").removeClass('menu-opened');
            }
          });
      }

      $(window).resize(function () {
        if (screenSize.is('xs, sm'))
          $scope.left = -370;
        else
          $scope.left = -440;
      });
    }
  };
}
function includeReplace() {
  return {
    require: 'ngInclude',
    restrict: 'A', /* optional */
    link: function (scope, el, attrs) {
      el.replaceWith(el.children());
    }
  };
}
function responsiveHeightToParent($window, $timeout) {
  return {
    scope: {}, // isolated scope: http://stackoverflow.com/a/17996984/2929757
    link: function (scope, el, attrs) {

      scope.$watch(function(){return $('.lightbox-image').css('height') ; }, function(newValue, oldValue){
        console.log("height", $('.lightbox-image').css('height'));
        if(newValue){
          console.log("newValue", newValue);
          console.log("oldValue", oldValue);
          $timeout(function(){
            scope.onResize();
          }, 500);
        }
      });

      scope.onResize = function () {
        console.log("offset", $(el).closest('.modal-content')[0].offsetHeight );
        $(el).css('margin-top',($(el).closest('.modal-content')[0].offsetHeight)/2 - 25);
      }
      scope.onResize();

      angular.element($window).bind('resize', function () {
        scope.onResize();
      })
    }
  }
}
function imagesLoaded($rootScope,$timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elem, $attr) {
      //https://github.com/mankindsoftware/angular-isotope/issues/15
      $timeout(function() {
        angular.element($elem).isotope({
          onLayout: function () {
            angular.element($elem).imagesLoaded(function () {
              angular.element($elem).isotope('reLayout');
              $rootScope.$broadcast('imagesLoaded');
            });
          }
        });
      });
    }
  };
}
function previewImage($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {

      /*
      element.on('mouseenter', function() {
        console.log("qui");
      });
      element.on('mouseleave', function() {
        console.log("qui");
      });
       */
      scope.cond = false;
      element.on('mouseenter', function() {
        $timeout(function(){
          console.log("QUA");
          scope.cond = true;
        }, 100);
      });
      element.on('mouseleave', function() {
        $timeout(function(){
          console.log("QUI");
          scope.cond = false;
        }, 100);
      });

    }
  };
}
function rightClickDisable($parse) {
  return {
    restrict: 'A',
    link: function ($scope, $ele) {
      $ele.bind("contextmenu", function (e) {
        e.preventDefault();
      });
    }
  };
};
/////////////// DIRECTIVES ////////////////

/////////////// FILTERS ////////////////
function htmlToPlaintext() {
  return function(text) {
    return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
  };
}
/////////////// FILTERS ////////////////

/////////////// SERVICES ////////////////
function dataHubSrvc($http, $q, ENV) {
  function _getTaxonomyTerm(termId) {
    return $q(function (resolve, reject) {
      var _apiEndpoint = ENV.hostEndpoint;
      $http({
        method: 'GET',
        headers: {
          'Content-Type': 'application/hal+json'
        },
        url: _apiEndpoint + "/taxonomy/term/" + termId + "?_format=json"
      }).then(function successCallback(response) {
          resolve(response.data);
        }, function errorCallback(response) {
          reject(response.status);
        }
      );
    });
  }

  return {
    getView: function (viewUrl) {
      return $q(function (resolve, reject) {
        var _apiEndpoint = ENV.hostEndpoint;

        $http({
          method: 'GET',
          headers: {
            'Content-Type':'application/hal+json'
          },
          url: _apiEndpoint + "/" + viewUrl + "?_format=json"
        }).then(function successCallback(response) {
            resolve(response.data);
          }, function errorCallback(response) {
            reject(response.status);
          }
        );
      });
    },
    getNode: function (nodeId) {
      return $q(function (resolve, reject) {
        var _apiEndpoint = ENV.hostEndpoint;

        $http({
          method: 'GET',
          headers: {
            'Content-Type':'application/hal+json'
          },
          url: _apiEndpoint + '/node/' + nodeId + "?_format=json"
        }).then(function successCallback(response) {
            resolve(response.data);
          }, function errorCallback(response) {
            reject(response.status);
          }
        );
      });
    },
    getProjectTypes: function(projects){
    return $q(function(resolve,reject){
      var project_types = [];
      var ret = [];
      for(var i=0; i<projects.length; i++){
        if(projects[i].field_project_types){
          for(var j =0; j< projects[i].field_project_types.length; j++){
            if(!project_types[projects[i].field_project_types[j].target_id]){
              _getTaxonomyTerm(projects[i].field_project_types[j].target_id).then(function(term){
                // $scope.project_types[projects.field_project_types[i].target_id]
                if(term && !project_types[term.tid[0].value]){

                  project_types[term.tid[0].value]=true;
                  ret.push({key:term.tid[0].value, value:term.name[0].value});
                }

                if(i == projects.length)
                  resolve(ret);
              });
            }
          }
        }
      }
    });
  },
    sendWebFormData: function(data){
      return $q(function (resolve, reject) {
        $http.post('http://www.merakistudio.it/webform/webform.php', JSON.stringify(data))
          .success(function(response){
          resolve(response);
        }).error(function(response){
          reject(response);
        });
      });
    }
  }
}
/////////////// SERVICES ////////////////

