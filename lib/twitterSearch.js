var Twitter = require("twit"),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    Credentials = require('../credentials/twitter.js');

function TwitterSearch(config) {
    if (!(this instanceof TwitterSearch)) return new TwitterSearch(config)
    this.config = config;
    this.twit = new Twitter({
        consumer_key: Credentials.consumer_key,
        consumer_secret: Credentials.consumer_secret,
        access_token: Credentials.access_token_key,
        access_token_secret: Credentials.access_token_secret,
    });
}

TwitterSearch.prototype = Object.create(EventEmitter.prototype);

TwitterSearch.prototype.list = function() {
    var self = this,
        slug = this.config.slug,
        owner = this.config.owner;
        // TODO min/max id could be useful

    // if no slug default to something
    if (!slug && !owner) {
        slug = 'public-radio-people';
        owner = 'nprnews';
    }

    // callback to pass to get request
    var handler = function(err, reply) {
        if (err === null) {
            console.log("Connection established");
            self.processList(reply, function(list) {
                self.emit('data', list)
            });
        }
        else {
            self.emit('error', new Error('Connection Error'));
        }
    };

    self.twit.get('lists/statuses', {
        slug: slug,
        owner_screen_name: owner
    }, handler);
}

TwitterSearch.prototype.processList = function(list, handler) {
    var self = this;

    // comment this out to get tweets in all languages
    list = list.filter(function(tweet) {
        return tweet.lang === 'en'
    });


    // TODO include support for location


    function processRetweet(tweet) {
        if (tweet.retweeted_status) {
            return tweet.retweeted_status.id_str
        } else return false
    }

    function getTags (tweet) {
        var retval = []
        //Start with hashtags
        _.each(tweet.entities.hashtags, function(tag, index) {
            retval.push(tag.text.toLowerCase())
        })
        //For each of the keywords, check if in string
        _.each(self.filters, function(key, index) {
            if (!_.contains(retval, key) &&
                tweet.text.toLowerCase().indexOf(key) !== -1)
            retval.push(key);
        });
        return retval
    }


    function getMedia (tweet) {
        if (tweet.entities.media) {
            return tweet.entities.media[0].media_url;
        }
        else {
            return "";
        }
    }

    function formatDate(tweet) {
        var hours = tweet.getHours();
        var minutes = tweet.getMinutes();
        var suffix = "AM";

        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }

        if (hours === 0) hours = 12;
        if (minutes < 10) minutes = "0" + minutes;

        return hours + ":" + minutes + " " + suffix;
    }

    var parsed = list.map(function(tweet) {
        return {
            time: formatDate(new Date(tweet.created_at)),
            text: tweet.text,
            user: '@' + tweet.user.screen_name,
            user_id: tweet.user.id_str,
            user_image: tweet.user.profile_image_url,
            categories: getTags(tweet),
            media: getMedia(tweet),
            id_str: tweet.id_str,
            retweets: tweet.retweet_count || 0,
            retweeted_status: processRetweet(tweet)
        }
    });

    handler(parsed);
}

module.exports = TwitterSearch;
