var express             = require("express"),
    router              = express.Router(),
    request             = require("request"),
    ogScrape            = require('open-graph-scraper'),
    async               = require("async"),
    display             = require("../js/display");

//SHOW ROUTE
router.get("/", function (req,res) {
    var request = require('request');
    var count   = null;
    var after   = null;
    
    req.query.count ? count = req.query.count : "" ;
    req.query.after ? after = req.query.after : "" ;
    if (count && count != "" && after && after != "") {
        var url = 'https://www.reddit.com/.json?count=' + count + "&after=" + after
        display.subreddit(url,req,res);   
    } else {
        var url = 'https://www.reddit.com/.json'
        display.subreddit(url,req,res); 
    }
});

module.exports = router;