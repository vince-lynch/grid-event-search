angular.module('MyApp', ['ngRoute', 'satellizer'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/grid-test', {
        templateUrl: '/grid-test/views/grid.html',
        controller: 'GridCtrl'
      })

      .otherwise({
        templateUrl: 'partials/404.html'
      });




  });
