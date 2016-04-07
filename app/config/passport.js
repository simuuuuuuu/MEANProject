/*Making a variable for google Outh2strategy which uses passport-google-oauth package*/
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var TumblrStrategy = require('passport-tumblr').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
/*Loding up the users and auth module in the javascript file*/
var User       = require('../../app/schema/users.js').User;
var configAuth = require('./auth');
global.useremail="";
global.twitterid="";
module.exports = function(passport) {

    /*Used to store the information of user into a session based on the user id
    Could not make the server work since I forgot to use these methods. Turns out
    these are indespensible for the authentication to perform with passport
    */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user based on the user id.
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
   /* Code for logging in the user with the google strategy.*/
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

       
        process.nextTick(function() {

            /*This code checks if the user is already stored in database or not
            If the user is not stored in the database then a new entry is created
            with profile id, name, token, email 
            Else a message is printed that the user exists with the profile id
            */
         
            User.findOne({ 'profileid' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    
                    global.useremail= user.email.split("@")[0];
                    console.log("Existing user" + profile.id);
                  
                    return done(null, user);
                } else {
                  
                    var newUser          = new User();
                    newUser.profileid    = profile.id;
                    newUser.token = token;
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    global.useremail= profile.emails[0].value.split("@")[0];
                    console.log(global.useremail);
                    console.log("new user saved "+newUser);
                    /*Saves the user credentials in the database*/
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                            /*The user is successfully logged in and user data is saved*/
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

     passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
         profileFields: ['id', 'emails', 'name']

    },
    function(token, refreshToken, profile, done) {

       
        process.nextTick(function() {

            /*This code checks if the user is already stored in database or not
            If the user is not stored in the database then a new entry is created
            with profile id, name, token, email 
            Else a message is printed that the user exists with the profile id
            */
         
            User.findOne({ 'profileid' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    
                    global.userid= user.profileid;
                    console.log("Existing user" + profile.id);
                    console.log(user.token);
                    return done(null, user);
                } else {
                    
                    var newUser          = new User();
                    newUser.profileid    = profile.id;
                    console.log(newUser.profileid);
                    newUser.token = token;
                     console.log(newUser.token);
                    newUser.name  =  profile.name.givenName + ' ' + profile.name.familyName;
                     console.log(newUser.name);
                    newUser.email = profile.emails[0].value; // pull the first email
                     console.log(newUser.email);
                    global.userid= profile.id;
                    console.log(global.userid);
                  
                    console.log("new user saved "+newUser);
                    /*Saves the user credentials in the database*/
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                            /*The user is successfully logged in and user data is saved*/
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

   
    passport.use(new TumblrStrategy({
    consumerKey: configAuth.tumblrAuth.consumerKey,
    consumerSecret: configAuth.tumblrAuth.consumerSecret,
    callbackURL: configAuth.tumblrAuth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({ 'profileid': profile.id }, function (err, user) {
      if(err){
          console.log("Error finding the data tumblr user in DB");
      }
      if(user){
      global.tumblrusername = profile.username;
      console.log("Existing user: "+ user.profileid);
      return done(null, user);
         }
         else{
             console.log(profile);
             var newUser = new User();
             newUser.profileid = profile.id;
             console.log(profile.id);
             newUser.token = token;
             console.log(token);
             newUser.tokenSecret = tokenSecret;
             console.log(tokenSecret);
             newUser.username = profile.username;
             console.log(profile.username);
             global.tumblrusername = profile.username;
             newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
             
         }
    });
  }
));
    
    passport.use(new LinkedInStrategy({
    clientID: configAuth.linkedinAuth.consumerKey,
    clientSecret: configAuth.linkedinAuth.consumerSecret,
    callbackURL: configAuth.linkedinAuth.callbackURL,
    scope : ['r_emailaddress', 'r_basicprofile', 'w_share'],
  },
   function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'profileid': profile.id }, function (err, user) {
        if(err){
            console.log("Error finding the linkedin user");
        }
        if(user){
            global.linkedinid = user.profileid;
      return done(null, user);
        }
        else{
            
            var newUser = new User();
            newUser.profileid = profile.id;
            global.linkedinid = profile.id;
            console.log(profile.id);
            newUser.token       = accessToken;
            console.log(accessToken);
            newUser.username    = profile.username;
            console.log(profile.username);
            console.log("Linkedin user  is: "+newUser);
                    // save our user into the database
            newUser.save(function(err) {
            if (err)
                throw err;
                return done(null, newUser);
            });
        }
    });
  }
));
     passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'profileid' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    global.twitterid            = user.profileid;
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();
                    
                    // set all of the user data that we need
                    newUser.profileid          = profile.id;
                    global.twitterid            = profile.id;
                    console.log(profile.id);
                    newUser.token       = token;
                    console.log(token);
                    newUser.tokenSecret = tokenSecret;
                    console.log(tokenSecret);
                    newUser.username    = profile.username;
                    console.log(profile.username);
                    console.log("Twitter user  is: "+newUser);
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

    });

    }));

};
