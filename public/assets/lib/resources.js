(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['bluebird', 'lodash', 'jquery'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.Resources = factory(root.Promise, root._, root.jQuery);
    }
}(this, function(Promise, _, $) {
    if(!Promise) throw new Error('Bluebird.js is not available');
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');
    if(!FS.Template) throw new Error('FS.Template is not available');

    var ResourcesFactory = function() {

        /**
        * @param - tasks - object or array of objects
        * task object signature : { url: 'app base url', type: 'templates|scripts|styles', files: ['file1.js', 'file2.dust.html']}
        * @return Promise, will be resolved when all tasks are completed
        **/
        ResourcesFactory.prototype.loadContent = function(tasks) {
            if (!tasks) {
                return Promise.resolve();
            }
            if (!_.isArray(tasks)) {
                tasks = [tasks];
            }

            return Promise.all(_.flatten(
                _.map(tasks, function(task) {
                    var baseTaskUrl = [task.url, task.type].join('');
                    return _.map(task.files, function(file) {
                        var url = [baseTaskUrl, file].join('/');
                        var currentTask;
                        switch (task.type) {
                            case 'templates': {
                                currentTask = loadTemplate(url, task.appName + '/' + file);
                                break;
                            }
                            case 'scripts': {
                                currentTask = new Promise(function(resolve) {
                                    yepnope({
                                        load: url,
                                        complete: resolve
                                    });
                                });
                                break;
                            }
                            case 'styles': {
                                currentTask = new Promise(function(resolve) {
                                    yepnope.injectCss(url, resolve);
                                });
                                break;
                            }

                            default:
                                throw new Error("Could not load resource of unknown type.");
                        }
                        return currentTask;
                    });
                })
            ));
        };

        /**
        * @param - tasks - object or array of objects
        * task object signature : { url: 'app base url', type: 'forms-definitions', files: ['file1.json', 'file2.json']}
        * @return Promise, will be resolved when all tasks are completed
        **/
        ResourcesFactory.prototype.loadFormDefinition = function (tasks) {
            if (!tasks) {
                return Promise.resolve();
            }
            if (!_.isArray(tasks)) {
                tasks = [tasks];
            }
            return Promise.all(_.flatten(_.map(tasks, function(task) {
                return _.map(task.files, function(file) {
                    return loadFile(task.url + task.type + '/' + file, file);
                });
            })));
        };

        ResourcesFactory.prototype.loadExternalFormDefinition = _.memoize(function(url, fileFriendlyName) {
            return Promise.props({
                fileName: fileFriendlyName || url,
                fileContent: FS.API.get('/GetFormDefinition', {url: url})
            });
        });

        var loadTemplate = _.memoize(function(url, dustCacheName) {
            return loadFile(url)
                .then(function(result) {
                    return FS.Template().add(result.fileContent, dustCacheName || url);
                });
        });

        var loadFile = _.memoize(function(url, fileFriendlyName) {
            return Promise.props({
                fileName: fileFriendlyName || url,
                fileContent: $.ajax(url)
            });
        });
    };

    return new ResourcesFactory();
}));