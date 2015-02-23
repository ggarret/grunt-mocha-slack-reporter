(function () {
    var Base, Slack;

    Base = require('mocha').reporters.base;
    var request  = require('request');
    var deferred = require('deferred');

    Slack = (function () {
        function Slack(runner, options) {
            var failures, passes, slack;
            passes = 0;
            failures = 0;
            
            runner.on("pass", function (test) {
                var messageOptions;
                passes++;
                
                messageOptions = {
                    username: "PASS: " + test.fullTitle(),
                    text: test.fullTitle(),
                    channel: options.reporterOptions.channel,
                    icon_url: options.reporterOptions.icon_url
                };
                
                if (options.reporterOptions.passIcon) {
                    messageOptions.icon_emoji = options.reporterOptions.passIcon;
                }
                
                if (true === options.reporterOptions.showPass)
                {
                    send(messageOptions);
                }
            });
            runner.on("fail", function (test, err) {
                var messageOptions;
                failures++;
                
                messageOptions = {
                    username: "FAIL: " + test.fullTitle(),
                    text: err.message,
                    channel: options.reporterOptions.channel,
                    icon_url: options.reporterOptions.icon_url
                };
                
                if (options.reporterOptions.failicon)
                {
                    messageOptions.icon_emoji = options.reporterOptions.failicon;
                }
                
                if (true === options.reporterOptions.showFail)
                {
                    send(messageOptions);
                }
            });
            runner.on("end", function () {
                var messageOptions;
                
                messageOptions = {
                    url: options.reporterOptions.url,
                    username: " Tests Completed",
                    text: ">>>*Build:* " + new Date() + " \n *Passed:* " + passes + "\n *Failed:* " + failures,
                    channel: options.reporterOptions.channel,
                    icon_url: options.reporterOptions.icon_url
                };
                
                if (options.reporterOptions.endIcon)
                {
                 messageOptions.icon_emoji = options.reporterOptions.endIcon;
                }
                
                send(messageOptions);
                sleep(10000);
            });
        };
        
        function send(message, cb)
        {
            if (!message.text)
            {
              if (cb) cb.call(null,{message:'No text specified'},null);
              return;
            }
            
            if (!message.channel) { message.channel = '#general'; }


            var command = message.url;

            var body = {
              channel:  message.channel,
              text:     message.text,
              username: message.username
            };

            if (message.icon_url) { body.icon_url = message.icon_url; }
            if (message.icon_emoji) { body.icon_emoji = message.icon_emoji; }
            if (message.attachments) { body.attachments = message.attachments; }
            if (message.unfurl_links) { body.unfurl_links = message.unfurl_links; }
            if (message.link_names) { body.link_names = message.link_names; }

            var option = {
              proxy: (this.http_proxy_options && this.http_proxy_options.proxy) || process.env.https_proxy || process.env.http_proxy,
              url:   command,
              body:  JSON.stringify(body)
            };

            if(!cb) var d = deferred();

            var req = request.post(option, function(err, res, body) {
              if (!err && body!='ok') {
                err = {message: body};
                body = null;
              }    
              if (d) return err ? d.reject(err) : d.resolve({res: res, body: body});
              if (cb) return cb.call(null, err, body);
              return null;
            });
        };
        
        return Slack;
    })();

    module.exports = Slack;

}).call(this);
