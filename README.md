grunt-mocha-slack-reporter
=======================


-------------

Add to Gruntfile.js : 

    mochaTest: {
            test: {
                src: ['test/*.js'],
                options: {
                    reporter: 'grunt-mocha-slack-reporter',
                    timeout : 3000,
                    reporterOptions:
                    {
                        url: 'https://hooks.slack.com/services/test/test/test',
                        channel: "test",
                        icon_url: "http://test.com/test.png",
                        showPass: false,
                        showFail: false
                    }
                },
            },
        },

