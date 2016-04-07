/*used to export the entities defined to be used in othr files.
Here I am making a generic file that stores the client ID, the client secret and the callbackURL 
to be used on by other javascript files and eliminating any need to look for other places i oder to change. 
Making it convinient to change in one file only.
*/

module.exports={
    
    'facebookAuth' : {
        
        'clientID' : "1774929782730810",
        'clientSecret' : "37e024d39fb0e9bde0789bbe8801b338",
        'callbackURL' : "https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/auth/facebook/callback"
    },
    
    'twitterAuth' : {
        
        'consumerKey' : "6u35WqntD5eEAkz7670TMpYUM",
        'consumerSecret' : "HuQndYYgQwASxWIpZA7OR0a8YMuZ7ONvCMBuHGvNWHbLkY1WRW",
        'callbackURL' : "https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/auth/twitter/callback"
    },
    
    'linkedinAuth' :{
        
         'consumerKey' : "77zncpz1kolhpz",
        'consumerSecret' : "sn1rgjBTz4dzGswP",
        'callbackURL' : "https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/auth/linkedin/callback"
        
    },
    
    'tumblrAuth' :{
        
        'consumerKey' : "1JUDmS9JaxCBke265EshYRKM3cvdjrID9XBXocU14RvVVaXQcg",
        'consumerSecret' : "CqsNJyCaKgw5MScZvIlVBk22z49YzlfHxye8MVNkHSdmOYqOgU",
        'callbackURL' : "https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/auth/tumblr/callback"
    },
    
    'googleAuth' : {
        
        'clientID' : "290443448673-hjl6qusqig95340ppaggfkedst1atuv9.apps.googleusercontent.com",
        'clientSecret' : "eh84qe00uIese3wpu5q294lS",
        'callbackURL' : "https://hbillin-ece9065-finalproject-simuuuuuuu.c9users.io/auth/google/callback"
    }
};