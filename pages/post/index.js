var template = require('view-engine').load(require.resolve('./template.rhtml'));

exports.render = function render(data) {
    var site = data.site;
    var outputDir = data.outputDir;
    var post = data.post;
    var olderPost = data.olderPost;
    var newerPost = data.newerPost;
    var bodyHtml = data.bodyHtml;

    return template.stream({
        site: site,
        post: post,
        outputDir: outputDir,
        newerPost: newerPost,
        olderPost: olderPost,
        bodyHtml: bodyHtml
    });
};