var viewEngine = require('view-engine');
var nodePath = require('path');
var Feed = require('feed');
var helpers = require('./helpers');
var async = require('async');
var fs = require('fs');

viewEngine.configure({
    engines: {
        'view-engine-raptor': {
            extensions: ['rhtml']
            // Any additional config...
        }
    }
});

function dateComparator(a, b) {
    a = a.date.getTime();
    b = b.date.getTime();

    return a - b;
}

exports.generate = function generate(site, util, callback) {

    var feed = new Feed({
        title:          site.title,
        description:    site.description,
        link:           site.url,
        image:          'http://example.com/image.png',
        copyright:      site.copyright,
        author:         site.author
    });


    var outputDir = site.outputDir || nodePath.join(process.cwd(), 'public');
    var staticDir = nodePath.join(outputDir, 'static');

    var queue = require('./queue').create(function(err) {
        if (err) {
            return callback(err);
        }

        var atomXml = feed.render('atom-1.0');
        var rssXml = feed.render('rss-2.0');

        async.series([
            function writeAtomXml(callback){
                fs.writeFile(nodePath.join(outputDir, 'atom.xml'), atomXml, 'utf8', callback);
            },
            function writeRSSXml(callback){
                fs.writeFile(nodePath.join(outputDir, 'rss.xml'), rssXml, 'utf8', callback);
            }
        ], callback);
    });

    
    
    require('raptor-optimizer').configure({
        fileWriter: {
            outputDir: staticDir,
            urlPrefix: '/static'
        }
    });

    queue.push(function writeIndex(callback) {
        util.writeFile(
            require('./pages/index').render({
                site: site,
                outputDir: outputDir
            }),
            nodePath.join(outputDir, 'index.html'),
            callback);
    });

    var posts = [].concat(site.posts.all);
    posts.sort(dateComparator);

    posts.forEach(function(post, i) {
        var newerPost = i > 0 ? posts[i-1] : null;
        var olderPost = i < posts.length - 1 ? posts[i+1] : null;


        var outputFile = nodePath.join(outputDir, post.name, 'index.html');
        queue.push(function writeIndex(callback) {
            var authors = post.author || post.authors;
            var contributors = post.contributor || post.contributors;

            if (authors && !Array.isArray(authors)) {
                authors = [authors];
            }

            if (contributors && !Array.isArray(contributors)) {
                contributors = [contributors];
            }

            post.markdownFile.readBodyHtml(function(err, bodyHtml) {
                feed.addItem({
                    title: post.title,
                    link: helpers.postUrl(post),
                    description: bodyHtml,
                    author: authors,
                    contributor: contributors,
                    date: post.date,
                    image: post.image
                });

                util.writeFile(
                    require('./pages/post').render({
                        site: site,
                        outputDir: nodePath.dirname(outputFile),
                        post: post,
                        newerPost: newerPost,
                        olderPost: olderPost,
                        bodyHtml: bodyHtml
                    }),
                    outputFile,
                    callback);
            });
            
        });
    });

    site.postCategories.all.forEach(function(postCategory) {

        queue.push(function writeIndex(callback) {
            util.writeFile(
                require('./pages/category').render({
                    site: site,
                    outputDir: outputDir,
                    postCategory: postCategory 
                }),
                nodePath.join(outputDir, 'category', postCategory.name, 'index.html'),
                callback);
        });
    });
    
};