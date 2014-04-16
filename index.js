var viewEngine = require('view-engine');
var nodePath = require('path');

viewEngine.configure({
    engines: {
        'view-engine-raptor': {
            extensions: ['rhtml']
            // Any additional config...
        }
    }
});


module.exports = function createGenerator(site, util) {
    var outputDir = site.outputDir;
    var staticDir = nodePath.join(outputDir, 'static');

    require('raptor-optimizer').configure({
        fileWriter: {
            outputDir: staticDir,
            urlPrefix: '/static'
        }
    });

    return {
        before: function(callback) {
            callback();
        },

        after: function(callback) {
            callback();
        },

        generatePost: function(post, callback) {
            return require('./pages/post').render({
                site: site,
                post: post,
                generator: this
            });
        },

        generateIndex: function(callback) {
            return require('./pages/index').render({
                site: site,
                generator: this
            });
        },

        generatePostCategory: function(postCategory, callback) {
            return require('./pages/category').render({
                site: site,
                postCategory: postCategory,
                generator: this
            });
        }
    };
};