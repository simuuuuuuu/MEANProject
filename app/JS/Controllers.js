/*global app*/
/*global angular*/

/*---------------------------------------------------------------------------
----------------------------------------------------------------------------
    WHEN DELETING THE POST FOR FACEBOOK PLEASE REFRESH IT MANUALLY MAY BE TWICE, I DON"T KNOW
    WHY BUT IT WONT REFRESH USING THE COMMAND TO REFLECT CHANGES! IT DOES DELETE
                       THE POST FROM THE BACK END THOUGH                         */

function createControllers(app){

/*I was not able to figure out why the value I was passing on to another view was not reflecting
Turns out when it loads the view again it makes a fresh call to th controller So I used Factory to
pass the value from one view to another! Here I am passing the value of the post id which is then 
retrieved when fetching comments using the idService
*/
app.factory('idService',function(){
    var myidService = {};
    var mypersistentid = {};
    return{
        savemyidService : function(id)
        {
        mypersistentid = id;
        console.log("value of id in factory : "+ id);
        },
        getmyidService : function(){
        return mypersistentid;
        }
};
    
});

/*I created a sigle loginController as opposed to different controllers in the first assignment becasue 
I was unable to load the views with different controllers */

app.controller('loginController',['$scope','$document','$http','$location','$rootScope','idService','$window',  function($scope,$document,$http,$location,$rootScope,idService,$window){
    
/*Storing the information about the client in the cookie
temp stores the user information which here is the useremail
Based on this value, we retrieve the posts
*/    
// $scope.temp = $document[0].cookie; 
var allcookies = $document[0].cookie;
console.log("All Cookies : " + allcookies );

var cookiearray = allcookies.split(';');

for(var i=0; i<cookiearray.length; i++){
var name = cookiearray[i].split('=')[0];
var value = cookiearray[i].split('=')[1];

if(name.trim()=="facebookuserid"){
    $scope.facebookuserid=value;
    
}
else if(name.trim()=="gmailuser"){
    $scope.useremail=value;
   
}
else if(name.trim()=="twitteruserid"){
    $scope.twitterid = value;
    
}
else if(name.trim()=="linkedinid"){
    $scope.linkedinid = value;
}
}
 //Initailizing the variables
 $scope.post = "";
 $scope.id = "";
 $rootScope.comments = "";
 $scope.mycomments = "";
 $rootScope.headermessage = "";
 $scope.media1=""
 $rootScope.facid = "";
 $scope.facebookid = "";
  $scope.getcomments = function(id){
    /*This functions initializes te value in the factory so that it can be retrieved later
    and then loads the view for specific post comments*/
     idService.savemyidService(id);
     $location.path('/specificpostcomments');
     
 };

 
 $scope.deletepost = function(id){
     /*This variable stores the request to be sent to the server*/
     var mediaid;
     if($scope.facebookuserid!=null){
             $scope.media1 = "facebook";
             mediaid = $scope.facebookuserid;
             $scope.headermessage ="You are logged in with "+ $scope.media1;
             console.log($scope.headermessage);
         }
         else if($scope.twitterid!=null){
             $scope.media1 = "twitter";
             mediaid = $scope.twitterid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         else if($scope.linkedinid!=null){
             $scope.media1 = "linkedin";
             mediaid = $scope.linkedinid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         console.log("deleting for post id" + id);
         console.log("and media "+ $scope.media1);
      var req = {
                 method: 'DELETE',
                 url: 'https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/api/post/'+id,
                 headers: {
                        'Content-Type': 'application/json'
                            },
                data: { "post": $scope.post,
                        "user": mediaid,
                        "media1" : $scope.media1
                   // "facebookuser": $scope.facebookuserid
                }
                      };
    
    /*If the controller gets a successful response then the view is reloaded in order to reflect 
    the ppost which was deleted. 
    */                                  
    $http(req).then(function successCallback(response) {
    if(response){
        console.log(response.data.message);
    $window.location.reload();
    }
    }, 
    /*Else an error message is displayed in the console log*/
    function errorCallback(response) {
    console.log("Can not delete");
      });              
      //$window.location.reload();                
     
 };

 $scope.createpost = function(){
     $scope.post = $document[0].getElementById("createpost").value;
     if($scope.facebookuserid==null&&$scope.twitterid==null&&$scope.linkedinid==null)
     alert("Kindly select a social media to post to!");
     /*This variable stores the request to be sent to the server*/
     else{
         var mediaid;
         if($scope.facebookuserid!=null){
             $scope.media1 = "facebook";
             mediaid = $scope.facebookuserid;
             $scope.headermessage ="You are logged in with "+ $scope.media1;
             console.log($scope.headermessage);
         }
         else if($scope.twitterid!=null){
             $scope.media1 = "twitter";
             mediaid = $scope.twitterid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         else if($scope.linkedinid!=null){
             $scope.media1 = "linkedin";
             mediaid = $scope.linkedinid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
     var req = {
                 method: 'POST',
                 url: 'https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/api/post',
                 headers: {
                        'Content-Type': 'application/json'
                            },
                data: { "post": $scope.post,
                    "user": $scope.useremail,
                    "media1": $scope.media1,
                    "userid": mediaid
                }
                      };
      /*After the post has been successfully posted, it loads the view for tracked posts and it
      displays all the new posts in te tracked page*/                          
    $http(req).then(function successCallback(response) {
    if(response){
    $document[0].getElementById("createpost").value = response.data.message;  
    console.log(response.data.message);
   
    }
    }, 
    /*Else an error message is displayed in the console log*/
    function errorCallback(response) {
    console.log("Can not get the values!");
      });
     } 
 };
 

 /*This function is fired when the view is loadedusing the ng-init*/
 $scope.init = function(){
    
  
         
     if($location.path() === '/posttracking')
     {
          
         
          var mediaid;
         if($scope.facebookuserid!=null){
             $scope.media1 = "facebook";
             mediaid = $scope.facebookuserid;
             $scope.headermessage ="You are logged in with "+ $scope.media1;
             console.log($scope.headermessage);
         }
         else if($scope.twitterid!=null){
             $scope.media1 = "twitter";
             mediaid = $scope.twitterid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         else if($scope.linkedinid!=null){
             $scope.media1 = "linkedin";
             mediaid = $scope.linkedinid;
              $scope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         
         console.log($scope.media1);
         var req = {
                 method: 'GET',
                 url: 'https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/api/post/'+mediaid,
                 headers: {
                        'Content-Type': 'application/json',
                        media1 : $scope.media1
                            }
                      };
         
         $http(req).then(function successCallback(response) {
    if(response){
      
        $scope.post = response.data.post;
        console.log($scope.post);
        
    }
    }, 
    function errorCallback(response) {
    console.log("Can not get the values!");
      });     
     } 
     
     /*This is used to get the laready initialzed value of the post id
     Based on the post id the comments are retrieved*/
     
         
         /*On intialization it checks if the view loaded is the specificpostcomments view*/
     if($location.path() === '/specificpostcomments'){
         var getcommentid = idService.getmyidService();
          console.log("Checkpoint 1 "+getcommentid);
         var mediaid;
         if($scope.facebookuserid!=null){
             $scope.media1 = "facebook";
             mediaid = $scope.facebookuserid;
             $rootScope.headermessage ="You are logged in with "+ $scope.media1;
             console.log($scope.headermessage);
         }
         else if($scope.twitterid!=null){
             $scope.media1 = "twitter";
             mediaid = $scope.twitterid;
              $rootScope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         else if($scope.linkedinid!=null){
             $scope.media1 = "linkedin";
             mediaid = $scope.linkedinid;
              $rootScope.headermessage ="You are logged in with "+ $scope.media1;
              console.log($scope.headermessage);
         }
         
         if($scope.media1=="facebook"){
    var r = {
        
                 method: 'GET',
                 url: 'https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/api/comment/'+getcommentid,
                 headers: {
                        'Content-Type': 'application/json',
                        media1 : $scope.media1
                            }
                      };
     $http(r).then(function successCallback(result) {
    if(result){
        /*If the server responds then the comments are set in the view*/
        $rootScope.comments = result.data.comment;
        console.log($rootScope.comments);
    }
    }, 
    /*Else an error message is displayed in the console log*/
    function errorCallback(result) {
    console.log("Sorry try again!");
      });  
         
     } 
         
         if($scope.media1=="twitter"){
            console.log($scope.mediaid);
        var request = {
                  method: 'GET',
                 url: 'https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/api/comment/'+getcommentid,
                 headers: {
                        'Content-Type': 'application/json',
                        media1 : $scope.media1,
                        user : mediaid
                            }
                      };
                      
        $http(request).then(function successCallback(response) {
    if(response){
        $rootScope.comments = response.data.comment;
        console.log($rootScope.comments);
       
    } 
    }, 
    /*Else an error message is displayed in the console log*/
    function errorCallback(response) {
    console.log("Sorry try again!");
      }); 
         
     } 
     }
 };
 
 /*The ng-init function init() is called*/
 $scope.init();
 

   

}]);
}