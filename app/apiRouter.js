var request= require('request');
var fb = require('fb');
var twitter = require('twitter');
var twit = require('twit');
var configauth = require('./config/auth.js');
var Linkedin = require('node-linkedin')(configauth.linkedinAuth.consumerKey, configauth.linkedinAuth.consumerSecret, configauth.linkedinAuth.callbackURL);
var tumblr = require('tumblrwks');
var Twitter = require('twitter-node-client').Twitter;
module.exports = function(app,router){
/*global useremail*/


/*All the necessary schemas are loaded!*/
var User = require('./schema/users.js').User;
var facebookPost = require('./schema/users.js').facebookPost;
var facebookComment = require('./schema/users.js').facebookComment;
var twitterPost = require('./schema/users.js').twitterPost;
var twitterComment = require('./schema/users.js').twitterComment;
var linkedinPost = require('./schema/users.js').linkedinPost;
var linkedinComment = require('./schema/users.js').linkedinComment;
/*This is used to check that the router is working*/
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



/*A router is creatd for the route /post*/

router.route('/post')

/*When there is a request for POST, this code finds the user corresponding to the email
and the stores the data into the mongodb
*/
    .post(function(req, res) {
        
        
            if(req.body.media1 == 'linkedin'){
                
                console.log(req.body.userid);
                
                
                User.findOne({'profileid': req.body.userid},function(err, user) {
                       if(err){
                           res.json({message: 'Error getting linkedin user in databse'});
                       } 
                       console.log(user);
                       
                        console.log("TOKEN for linkedin is     "+user.token);
                        var linkedin = Linkedin.init(user.token);
                        
                         var options = {
                       
                        comment : req.body.post, 
                        visibility: {
                            code : 'anyone'
                        } 
                         };
                            
                            
                  linkedin.people.share(options, function(err, response){
            if (err)
                console.log(err);
             else
              {
                  console.log(response);
                  console.log(response.updateKey);
                  if(response.updateKey){
                      
                      var linkedinpost = new linkedinPost();
                      linkedinpost._author = user.profileid;
                      linkedinpost.postbody = req.body.post;
                      linkedinpost.postURL = response.updateUrl;
                      linkedinpost.postid = response.updateKey;
                      
                      linkedinpost.save(function(err){
                        if(err){
                            console.log("Error saving the post in mongodb");
                        }
                        console.log("User data was saved as "+ linkedinpost);
                    });
                      
                  }
                  
              }
        });
                    res.json({message : "Your update was posted successfully"});
                    });            
    }
     
            
                if(req.body.media1=='twitter'){
                    console.log(req.body.userid);
                User.findOne({'profileid': req.body.userid},function(err, user) {
                       if(err){
                           res.json({message: 'Error getting twitter user in databse'});
                       } 
                       console.log(user);
                var client = new twitter({
                consumer_key: configauth.twitterAuth.consumerKey,
                consumer_secret: configauth.twitterAuth.consumerSecret,
                access_token_key: user.token,
                access_token_secret: user.tokenSecret
                });      
                client.post('statuses/update', {status: req.body.post},  function(error, tweet, response){
  if(error) throw error;
  //console.log(tweet);  // Tweet body. 
  //console.log(response);  // Raw response object. 

  
 var temp =  JSON.parse(response.body);
 console.log(temp);
  console.log("ID is:                            "+ temp.id_str);
 var twitterpostid = temp.id_str;
  
  var twitterpost = new twitterPost();
  twitterpost.postid = twitterpostid;
  twitterpost.postbody = req.body.post;
  twitterpost._author = user.profileid;
  twitterpost.save(function(err){
                        if(err){
                            console.log("Error saving the post in mongodb");
                        }
                        console.log("User data was saved as "+ twitterpost);
                    });
               });
  // Raw response object. 
  res.json({message: "Your tweet has been posted"});

                });       
                    
                }  
        
    
        
        
        

                if(req.body.media1=='facebook'){
                    console.log(req.body.userid);
                    User.findOne({'profileid': req.body.userid},function(err, user) {
                       if(err){
                           res.json({message: 'Error getting facebook user in databse'});
                       } 
                       console.log(user);
                       
                       fb.setAccessToken(user.token);
                       var body = req.body.post;
                       fb.api('me/feed', 'post', { message: body }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
  var fbpost = new facebookPost();
  fbpost._author = user.profileid;
  fbpost.postbody = req.body.post;
  fbpost.postid = res.id;
  fbpost.save(function(err){
                        if(err){
                            console.log("Error saving the post in mongodb");
                        }
                        console.log("User data was saved as "+ fbpost);
                    });
                         
                       });
                       res.json({message: "Your has been successfully posted to facebook!"});  
                    });
                } 
    })
           
    
    
    
    
  /*A router is created for the route /post/:post_id
  This route can be used to delete the post with the given post_id*/  
 router.route('/post/:post_id')
 .delete(function(req, res) {
     
     if(req.body.media1 =='linkedin'){
     
    User.findOne({'profileid': req.body.user}, function(err, user){
            
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            
            if(user){
                
                linkedinPost.findOne({'postid': req.params.post_id},function(err,linkedinpost){
            console.log(linkedinpost);
            if(err){
                console.log("Can not get the post!");
                res.send(err);
            }
            
              linkedinpost.remove(function(err){
                    if(err){
                        console.log("Error removing entry");
                    }
                    else{
                      console.log("Entry deleted from the database successfully!"); 
                    }
                });
  res.json({message: "Tweet deleted successfully"});
            
                });
                
            }
   }); 
     }
 
 if(req.body.media1=='twitter')
 {
    User.findOne({'profileid': req.body.user}, function(err, user){
            
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            
            if(user){
                
                twitterPost.findOne({'postid': req.params.post_id},function(err,twitpost){
            console.log(twitpost);
            if(err){
                console.log("Can not get the post!");
                res.send(err);
            }
            
            var twitbot = new twit({
  consumer_key:         configauth.twitterAuth.consumerKey,
  consumer_secret:      configauth.twitterAuth.consumerSecret,
  access_token:         user.token,
  access_token_secret:  user.tokenSecret,
  
});

            twitbot.post('statuses/destroy/:id', { id: req.params.post_id }, function (err, data, response) {
                if(err){
                    console.log("Error deleting tweet!");
                }
                
  console.log(data);
  twitpost.remove(function(err){
                    if(err){
                        console.log("Error removing entry");
                    }
                    else{
                      console.log("Entry deleted from the database successfully!"); 
                    }
                });
  res.json({message: "Tweet deleted successfully"});
});
 
                   });
                
            }
    });
    
 } 
    if(req.body.media1 == 'facebook')
   { 
    User.findOne({'profileid': req.body.user}, function(err, user){
            
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            
            if(user){
                console.log(user);
                /*This chceks for the post_id, if a particular post is
                found with the post_id the it is deleted else an error message is displayed*/
        facebookPost.findOne({'postid': req.params.post_id},function(err,fbpost){
            console.log(fbpost);
            if(err){
                console.log("Can not get the post!");
                res.send(err);
                   }
                fb.setAccessToken(user.token);
                fb.api(req.params.post_id, 'delete', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    
                fbpost.remove(function(err){
                    if(err){
                        console.log("Error removing entry");
                    }
                    else{
                      console.log("The Post was not found on the Facebook side! Hence we deleted from our database!");
                    }
                });
    return;
  }
  else{
  
                fbpost.remove(function(err){
                    if(err){
                        console.log("Error removing entry");
                    }
                    });
                
  console.log('Post was deleted');
  }
});
        res.json({message: "Entry deleted!"});      
        });
            }
    });
    
 }
     });
     
     /*This is another router for getting the posts corresponding to an email
     I learnt it the hard way that we can not send anything in the body using a GET request
     So hence created another router which gets the posts corresponding to a user
     */
     router.route('/post/:userid')
     
     .get(function(req, res) {
      if(req.headers.media1=="linkedin"){
          User.findOne({'profileid': req.params.userid}, function(err, user){
                 console.log(req.params.userid);
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            if(user){
              linkedinPost.find({_author: user.profileid}, function(err, linkedinpost){
                 if(err){
                     console.log("Error getting post data from database");
                 } 
                 console.log(linkedinpost);
                 res.json({post: linkedinpost});
              });  
            }
        });
      }
   
      
      else if(req.headers.media1 == "twitter"){
        User.findOne({'profileid': req.params.userid}, function(err, user){
                 console.log(req.params.userid);
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            if(user){
              twitterPost.find({_author: user.profileid}, function(err, twitterpost){
                 if(err){
                     console.log("Error getting post data from database");
                 } 
                 console.log(twitterpost);
                 res.json({post: twitterpost});
              });  
            }
        });
      }
     else if(req.headers.media1=="facebook"){
         console.log("Trying to get facebook posts");
          User.findOne({'profileid': req.params.userid}, function(err, user){
                 console.log(req.params.userid);
            if(err){
                res.json({message: 'Sorry error getting data'});
            }
            if(user){
              facebookPost.find({_author: user.profileid},function(err, fbpost) {
                  console.log(user.profileid);
                   if(err){
                   console.log("Error fetching post for the profileid");    
                       
                   }
                  
                   res.json({post: fbpost});
                }); 
               
           
            }
            });
      }
     });
     
     
  
        
    
 
 /*This is a router for the comments
 Although the CUD of the CRUD are unnecesarry for the lab but still
 I made them*/      

           
router.route('/twittercomment/:post_id')
.get(function(req, res) {
    global.tempbool = true;
    for(var i=0; i<global.twitterresponse.length;i++){
    if(global.twitterresponse[i].in_reply_to_status_id_str == req.params.post_id){
        twitterComment.find({'message': global.twitterresponse[i].text}, function(err, tcommenttemp) {
       if(err){
           console.log(err);
       }
       if(tcommenttemp.message!=null){
           global.tempbool =true;
       }
       else
       global.tempbool =false;
   });
    console.log(global.tempbool);
   if(global.tempbool){
         var twitcomment = new twitterComment();
        console.log(global.twitterresponse[i].text);
        twitcomment.message = global.twitterresponse[i].text;
        twitcomment.link = req.params.post_id;
        twitcomment.save(function(err){
                        if(err){
                            
                            console.log("Error saving comment");
                        }
        
    });
    console.log(twitcomment);
   }
    }
    }
    
    twitterComment.find({'link': req.params.post_id},function(err, tcomment){
       if(err){
           console.log(err);
       } 
       res.json({comment: tcomment});
    });
    
     
});
        

  
  
    
router.route('/comment/:post_id')

/*This is the main part which is necessary to get the comments for the particular post_id*/
.get(function(req, res) {
            
            if(req.headers.media1=='twitter'){
    
            User.findOne({'profileid': req.headers.user},function(err, user) {
                   if(err){
                       console.log("Error finding the user in db");
                   }
              console.log("user for twitter comments "+user.profileid);
        
            var twitt  = new twit({
  consumer_key:         configauth.twitterAuth.consumerKey,
  consumer_secret:      configauth.twitterAuth.consumerSecret,
  access_token:         user.token,
  access_token_secret:  user.tokenSecret,
 
});
            
            twitt.get('search/tweets', { q: "@webapptester48", count: 100 }, function(err, data, response) {
                if(err){
                    console.log(err);
                }
                var tempdata = JSON.stringify(data);
                
                var parseddata = JSON.parse(tempdata);
                console.log(parseddata);
                
                global.twitterresponse = parseddata.statuses;
                res.json({comment : parseddata.statuses});
          
});
                
                
                });
            }

        if(req.headers.media1=="facebook"){
        console.log('Trying to get facebook comments');
        console.log(req.params.post_id);
        facebookPost.findOne({'postid': req.params.post_id}, function(err, fbpost) {
            if (err){
                res.send(err);
            }
            if(fbpost){
                   console.log(fbpost);
                   var url = 'https://graph.facebook.com/'+req.params.post_id+'/comments';
                    console.log(url);
                    User.findOne({'profileid': fbpost._author}, function(err, user) {
                    if(err){
                        console.log('Error getting the user');
                    }     
                   
                    var params = {
                     access_token: user.token
                    };
    
                request.get({url: url, qs: params}, function(err, resp, body) {
                     if (err) {
                         return console.error("Error occured: ", err);
                     }
                     console.log("===============================================BODY IS==========================");
                     
                   var temp = JSON.parse(body);
                   var comments = temp.data;
                   console.log(comments);
                   res.json({comment: comments});
                    
                });
                
    
                    });
                   // res.json({comment: fbcomment});
               
            }
        });
        }
    })
    

 
 /*When the logout is done it clears the cache and ridericts to the login page*/   
router.get('/logout',function(req,res){
       res.clearCookie('gmailuser');
       res.redirect('/');
});



app.use('/api', router);

};

/*function postmessagefacebook(token, post, response){
 
  var url = 'https://graph.facebook.com/me/feed';
    var params = {
        access_token: token,
        message: post
    };  
    
    request.post({url: url, qs: params}, function(err, resp, body) {
      
      // Handle any errors that occur
      if (err) return console.error("Error occured: ", err);
      body = JSON.parse(body);
      if (body.error) return console.error("Error returned from facebook: ", body.error);

      // Generate output
      var output = '<p>Message has been posted to your feed. Here is the id generated:</p>';
      output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';
      
      response.json({message: output});
    });
    
}*/