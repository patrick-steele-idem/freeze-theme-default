function padTimeField(n){
    return n<10 ? '0'+n : n
}


exports.postDate = function(date) {
    return date.toLocaleDateString("en-US", {weekday: "long", year: "numeric", month: "long", day: "numeric"});
};

exports.categoryUrl = function(category) {
    var siteUrl = category.site.url;
    return siteUrl + 'category/' + category.name + '/';
};

exports.postUrl = function(post) {
    var siteUrl = post.site.url;
    return siteUrl + post.name + '/';
};

exports.machineDate = function(date) {
    return date.getUTCFullYear() + '-' +
       padTimeField(date.getUTCMonth()+1) + '-' +
       padTimeField(date.getUTCDate());
};