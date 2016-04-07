/*Defines all the variables for the dependencies to be used later on*/
/*mongodb tends to crash! If it does kindly delete the data folder
It may be the reason because its open in my multiple applications in cloud9

After deleting the data folder, type in these four commands in the terminal

mkdir data
echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
chmod a+x mongod
./mongod
*/
var express= require("express");
var app = express();
var port= process.env.PORT;
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var session =  require("express-session");
var mongoose = require("mongoose");
var router = express.Router(); 
var bodyParser = require("body-parser");
var passport = require("passport");
var http = require('http');

/*A httpServer is created using the express app*/
var httpServer = http.createServer(app);


/*a connection is setup with mongodb database using the mongoose*/
mongoose.connect("mongodb://"+process.env.IP+":"+27017+"/test");
//describes the http logger middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
/*If I did not used this the I could not load any Javacript or CSS or Views folder.*/
app.use(express.static(__dirname));
/*A session is created using random secret value */
app.use(session({
    secret: "assignment 2",
    saveUninitialized: true,
    resave: true
    
}));

/*The passport is initailsed in a session*/
app.use(passport.initialize());
app.use(passport.session());

/*calls are made to the passport.js and passportVerification.js files functionality of whose
is given in the files
*/
require("./app/config/passport.js")(passport);

require("./app/passportVerification.js")(app,passport);

require("./app/apiRouter.js")(app,router);
/*The http server is created and listens on the port given by port*/
httpServer.listen(process.env.PORT);
console.log('server running on port '+ port);
