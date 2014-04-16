var template = require('view-engine').load(require.resolve('./template.rhtml'));

exports.render = function render(data) {
    var site = data.site;
    var outputDir = data.outputDir;
    var posts = site.posts.all;

    return template.stream({
        site: site,
        posts: posts,
        outputDir: outputDir
    });
};