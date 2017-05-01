(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['bluebird', 'lodash', 'jquery'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.AppManager = factory(root.Promise, root._, root.jQuery);
    }
}(this, function(Promise, _, $) {
    if(!Promise) throw new Error('Bluebird.js is not available');
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');

    var AppManagerFactory = function() {
        var _apps = [];

        var getApps = _.once(function() {
            return FS.API.get('/apps2')
                .then(function(results) {
                        if(!results || !_.isArray(results.apps)) {
                            throw new Error('Invalid response from apps API');
                        }
                        return results.apps;
                    }
                );
        });

        /**
        * get
        * @return an app if filter specified
        * @return an empty object if filter specified and no app were found
        */
        AppManagerFactory.prototype.get = function(params) {
            return getApps().then(function(apps) {
                _apps = _.map(apps, function(app) {
                    return new FS.App(app);
                });
                if (params) {
                    return _.find(_apps, function(app) {
                        return app.name === params.app_options.load;
                    });
                }

                return _apps;
            });
        };

        /**
        * getWidgetInstances
        * @return array of JSON objects
        */
        AppManagerFactory.prototype.getWidgetInstances = function(filter) {
            var manifestTasks = _.map(_apps, function(app) {
                return app.getManifest();
            });
            return Promise.all(manifestTasks).then(function(manifests){
                return _.flatten(_.map(_apps, function(app) {
                    return app.getWidgetInstances(filter);
                }));
            });
        };
    };

    return new AppManagerFactory();
}));
