// turn off limits by default (BE CAREFUL)
require('events').EventEmitter.prototype._maxListeners = 100;

var express     = require("express"),
    app         = express();
    
//Require routes
var subredditRoutes = require("./routes/subreddit.js"),
    indexRoutes     = require("./routes/index.js");

//Set file type for views to EJS
app.set("view engine", "ejs");

//Expose the ./public folder for use
app.use(express.static('public'));

//Include the routes for use
app.use("/",indexRoutes);
app.use("/r",subredditRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Reddit News App started.")
});