'use strict';



/**
 * @ngdoc overview
 * @name f3monApp
 * @description
 * # f3monApp
 *
 * Main module of the application.
 */

(function() {

    $.ajaxSetup({cache:false});

  angular.module('f3monApp', [
    'ngAnimate',
    'ngMessages',
    'ngResource',
    'ngCookies',
    'ngTouch',
    'ngResource', 
    'emguo.poller',
    'percentage',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',    
    'mgcrea.ngStrap',
    'angularMoment',
    'ngTimezone'
  ]);



})();