var async = require('async');
var ok = require('assert').ok;

exports.create = function create(callback) {
    ok(typeof callback === 'function');
    
    var error = null;

    var queue = async.queue(
        function (task, cb) {
            
            task(function(err) {
                if (err) {
                    queue.kill(); // Don't accept any more tasks
                    error = err;
                    callback(err);
                }

                cb();
            });
        },
        5 /* concurrency */);



    var drained = false;
    queue.drain = function() {
        if (error || drained) {
            return;
        }
        drained = true;
        callback();
    };

    return queue;
};