
/*This initializes the schema using the mongoose
I have creted 3 schemas, one for the user nformation, other for the post information
and the third for the commnts The user and the post linked via profile id and the comments 
the post are linked by the object id the mongodb creates
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var userSchema = Schema({
    
        
        profileid: String,
        token: String,
        email: String,
        name: String,
        tokenSecret: String,
        facebookpost: [{
           type: Schema.ObjectId, ref: 'facebookPost' 
        }],
        twitterpost: [{
           type: Schema.ObjectId, ref: 'twitterPost' 
        }],
        linkedinpost: [{
           type: Schema.ObjectId, ref: 'linkedinPost' 
        }]
        
            
});

var facebookpostSchema = Schema({
    _author: {type: String, ref: 'User'},
    postbody: String,
    postid: String,
    comment: [{type:Schema.ObjectId, ref: 'facebookComment'}]
    
});

var twitterpostSchema = Schema({
    _author: {type: String, ref: 'User'},
    postbody: String,
    postid: String,
    comment: [{type:Schema.ObjectId, ref: 'twitterComment'}]
    
});

var linkedinpostSchema = Schema({
    _author: {type: String, ref: 'User'},
    postbody: String,
    postURL : String,
    postid: String,
    comment: [{type:Schema.ObjectId, ref: 'linkedinComment'}]
    
});

var facebookcommentSchema = Schema({
    
    link: String,
    commentbody: String
    
});

var twittercommentSchema = Schema({
    
    link: String,
    message: String
    
});

var linkedincommentSchema = Schema({
    
    link: String,
    commentbody: String
    
});

/*Finally the model is created with the given schema. For 3 schemas three models are created*/
var User = mongoose.model('User', userSchema);
var facebookPost = mongoose.model('facebookPost', facebookpostSchema);
var facebookComment = mongoose.model('facebookComment', facebookcommentSchema);
var twitterPost = mongoose.model('twitterPost', twitterpostSchema);
var twitterComment = mongoose.model('twitterComment', twittercommentSchema);
var linkedinPost = mongoose.model('linkedinPost', linkedinpostSchema);
var linkedinComment = mongoose.model('linkedinComment', linkedincommentSchema);
/*Finally these models are exported*/
module.exports.User = User;
module.exports.facebookPost = facebookPost;
module.exports.facebookComment = facebookComment;
module.exports.twitterPost = twitterPost;
module.exports.twitterComment = twitterComment;
module.exports.linkedinPost = linkedinPost;
module.exports.linkedinComment = linkedinComment;