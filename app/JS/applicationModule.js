/*global angular*/
/*global createControllers*/

/*The angular app is created which is reffered to by the variable app
This javascript file defines the route which routes based on the string in the url
I tried to use my previous method in lab1 but turns out that I could not load the views

After stressing for one whole day I referred the TA's website and realised that I using different 
controllers for different views which was creating the problem
Also I reffered stackoverflow where it mentioned that if I created two variables to be used in two
separate files for the angular app caused the problem. So I called the fucntion at the bottom of the 
script file which creates the controller and the same variable name is passed on to the controller.
*/
var app=angular.module('myApp',['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
      controller: "loginController",
      template: '<div ng-include="\'/app/Views/Login.html\'"></div>'
    })
    .when('/posting', {
        template:'<div ng-include="\'/app/Views/Posting.html\'"></div>',
    controller:'loginController'
    })
    .when('/specificpostcomments', {
      controller: "loginController",
      template: '<div ng-include="\'/app/Views/specificPostComments.html\'"></div>'
    })
    .when('/posttracking', {
      controller: "loginController",
      template: '<div ng-include="\'/app/Views/PostsTracking.html\'"></div>'
    })
    .otherwise({
      redirectTo: '/'
    });
});

createControllers(app);
