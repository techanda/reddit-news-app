var express             = require("express"),
    request             = require("request"),
    ogScrape            = require('open-graph-scraper'),
    async               = require("async");

var functionObj = {}
    
functionObj.subreddit = function (url,req,res){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var parsedData = JSON.parse(body).data.children;
            var postDataImg = [];
            var postDataTxt = [];
            async.each(parsedData,function(post, next){
                // console.log(post.data.id);
                ogScrape({'timeout': 3000, url: post.data.url},function(err, results){
                    if (err) {
                        var data = {
                            score:  post.data.score,
                            og:     {ogTitle: post.data.title},
                            st:     {
                                        permalink:  post.data.permalink,
                                        url:        post.data.url,
                                        title:      post.data.title,
                                        preview:    post.data.preview,
                                        comments:   post.data.num_comments
                                    }
                        }
                        postDataTxt.push(data);
                    } else {
                        var data = {
                            score: post.data.score,
                            og:   results.data,
                            st:     {
                                        permalink:  post.data.permalink,
                                        url:        post.data.url,
                                        title:      post.data.title,
                                        preview:    post.data.preview,
                                        comments:   post.data.num_comments
                                    }
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
                    postsTextOnly: postDataTxt.sort(function(a,b) {return (b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0);} ),
                    subreddit: req.params.subreddit,
                    allPosts: parsedData.sort(function(a,b) {return (b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0);} )
                });

            })
            
        }
    });
}

module.exports = functionObj;