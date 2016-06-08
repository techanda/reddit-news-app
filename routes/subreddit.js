var express             = require("express"),
    router              = express.Router(),
    request             = require("request"),
    ogScrape            = require('open-graph-scraper'),
    async               = require("async");

//SHOW ROUTE
router.get("/:subreddit", function (req,res) {
    var request = require('request');
    request('https://www.reddit.com/r/' + req.params.subreddit + '.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body).data.children;
            var postDataImg = [];
            var postDataTxt = [];
            async.each(parsedData,function(post, next){
                ogScrape({url: post.data.url},function(err, results){
                    if (err) {
                        var data = {
                            score: post.data.score,
                            og:   {ogTitle: post.data.title},
                            st:     post.data
                        }
                        postDataTxt.push(data);
                    } else {
                        var data = {
                            score: post.data.score,
                            og:   results.data,
                            st:     post.data
                        }
                        
                        if (data.og.ogImage && data.og.ogImage.url && data.og.ogImage.url != "") {
                            postDataImg.push(data);
                        } else {
                            postDataTxt.push(data);
                        }
                    }

                    next();
                })
            }, function(err, next){
                // res.send(postDataTxt);
                res.render("subreddit/",{
                    postsWithImages: postDataImg.sort(function(a,b) {return (b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0);} ), 
                    postsTextOnly: postDataTxt.sort(function(a,b) {return (b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0);} )
                });

            })
            
        }
    }) 
});

module.exports = router;