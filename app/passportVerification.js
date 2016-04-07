module.exports = function(app,passport){
    
    /*This file is reponsible for creating an express app and redirecting to index page when no
authentication is performed. */
app.get('/', function (req, res) {
  res.sendfile(__dirname+"/index.html");
});


app.get('/posting',isLoggedIn, function (req, res) {
res.sendfile(__dirname+"/index.html");
 });

    
    /*The app in the server gets the /auth/google initally when the login
        button is pressed, the passport autheticate goes to google with the scope
        profile and email
    */
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    /*When an acccess tocken is successfully retrieved from
    the goog it redirectes to the index page with the posting view loaded by default
    */
   app.get('/auth/google/callback',
            passport.authenticate('google',
            
            {
                    failureRedirect : '/'
            }),
            /*This successfully logins in the user and sets the cookie to the user email
            So that posts and comments can be retrieved bsed on the user email id since it is unique*/
            function(req, res) {
            res.cookie('gmailuser',global.useremail);
            res.redirect('/#/posting');
            }
            
            );
            
            
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : [ 'email', 'publish_actions'] }));
    
    app.get('/auth/facebook/callback',
            passport.authenticate('facebook',
            
            {
                    failureRedirect : '/'
            }),
            /*This successfully logins in the user and sets the cookie to the user email
            So that posts and comments can be retrieved bsed on the user email id since it is unique*/
            function(req, res) {
            res.clearCookie('twitteruserid');
            res.clearCookie('linkedinid');
            res.cookie('facebookuserid',global.userid);
            res.redirect('/#/posting');
            });
    
    
    app.get('/auth/linkedin', passport.authenticate('linkedin',{state: true}));
    
    app.get('/auth/linkedin/callback', 
            passport.authenticate('linkedin',
                    { 
                        failureRedirect: '/login' 
                        
                    }),
             function(req, res) {
    // Successful authentication, redirect home.Accounts
                    res.clearCookie('facebookuserid');
                    res.clearCookie('twitteruserid');
                    res.cookie('linkedinid',global.linkedinid);
                     res.redirect('/#/posting');
             });
             
    app.get('/auth/tumblr', passport.authenticate('tumblr', {scope : ['email']}));
    
    app.get('/auth/tumblr/callback', passport.authenticate('tumblr', { failureRedirect: '/login' }),
    function(req, res) {
    res.cookie('tumblrusername',global.tumblrusername);
    // Successful authentication, redirect home.
    res.redirect('/#/posting');
  });
         
            
    app.get('/auth/twitter', passport.authenticate('twitter', { scope : [ 'email', 'profile'] }));
    
    app.get('/auth/twitter/callback',
            passport.authenticate('twitter',
            
            {
                    failureRedirect : '/'
            }),
            /*This successfully logins in the user and sets the cookie to the user email
            So that posts and comments can be retrieved bsed on the user email id since it is unique*/
            function(req, res) {
                res.clearCookie('facebookuserid');
                res.clearCookie('linkedinid');
            res.cookie('twitteruserid',global.twitterid);
            res.redirect('/#/posting');
            });        

};




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session then they must carry on else they are redirected to the home page
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
    
}
