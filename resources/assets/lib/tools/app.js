(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'jquery', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.App = factory(root._, root.jQuery, root.Promise);
    }
}(this, function(_, $, Promise) {
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');
    if(!Promise) throw new Error('Bluebird is not available');

    /**
     * Create new instance of App
     * @param app Object returned FS.AppManager {'app_id', 'description', 'name', 'url', 'version'}
     * @constructor
     */
    var App = function App(app) {
        this.appId = app.app_id;
        this.description = app.description;
        this.name = app.name;
        this.url = app.url;
        this.version = app.version;
        this.manifest = {};
        this.requires = {
            styles: [],
            scripts: [],
            templates: []
        };
        this.options = {loginLink: '#loginLink'};

        /**
         * displayApp
         * @param [page] An optional page name/ID to render
         * @param [replace] An optional param which defines if we replace or not existing content
         * @param [$container] HTML element into which the app should be rendered
         * @param [appOptions] An object of extra options to pass to the app (i.e. arg/params)
         */
        function displayApp(page, replace, $container, appOptions) {
            var requestedPage;
            page = page || 0;
            appOptions = appOptions || {};

            // Mark all pages inactive, for use in navigation templates
            this.manifest.pages = _.omit(this.manifest.pages, 'active');

            return this.load().bind(this)
                .then(function() {
                    requestedPage = _.isString(page)
                        ? _.findWhere(this.manifest.pages, { name: page })
                        : this.manifest.pages[page];
                    if(!requestedPage || !requestedPage.template) {
                      throw new Error('Requested page has no associated template: ' + page);
                    }
                    this.options.arg = appOptions.arg;
                    this.options.params = appOptions.params;
                    
                    // Mark the current page as active, for use in navigation templates
                    requestedPage.active = true;

                    return _render.call(this, requestedPage.template);
                })
                .then(function(output) {
                    if(replace) $container.html(output);
                    else $container.append(output);
                    $container.data('created-by-app', this.manifest.name);
                    $container.data('created-by-page', requestedPage.name);
                    initLinkHandlers($container);
                })
                .caught(function(error) {
                    var alertContext = {
                      alertClass: 'danger',
                      alertTitle: 'Application Error',
                      alertBody: (error && error.message) || JSON.stringify(error), 
                      noClose: true
                    };
                    return FS.Template('alert', alertContext).into($container);
                }
            );
        };

        /**
         * render
         * @param template The name of the template to get
         * @return A promise to return the output of the template with the supplied context
         */
        function _render(template) {
            return FS.Auth.hasSession().bind(this)
                .then(function(session) {
                    return FS.Template(template, {
                        baseUrl: this.url,
                        manifest: this.manifest,
                        session: session,
                        user: session.user,
                        queryString: document.location.search.slice(1),
                        get: getQueryString(),
                        arg: this.options.arg || '',
                        params: this.options.params || {}
                    });
                  }
                );
        };

        /**
         * parseUrl
         * @param [url] The URL to parse. Defaults to the current page
         * @return An object with 2 properties: 'app' and 'page'
         */
        function parseUrl(url) {
            return new Router().getPageFromurl(url);
        };

        /**
         * initLinkHandlers
         * @param [target] An optional HTML element or selector into which the template should be rendered
         * TODO: Absorb _this into the router
         */
        function initLinkHandlers($target) {
          var _this = this;
          $target
            .on('click', 'a[data-page], a[data-app]', _.debounce(function(event) {
              event.preventDefault();
              var data = $(event.target).data();
              var page = {
                app: data.app || _this.manifest.name || '',
                page: data.page || _this.options.page || '',
                arg: data.arg || _this.options.arg || ''
              };

              if(data.target === '_blank') {
                window.open('/' + page.app + '/' + page.page + '?' + page.arg);
              } else {
                Router().loadPageByProps(page);
              }
            }, 100, true))
            .on('click', 'a[data-form-name], a[data-form-id], a[data-form-ref], a[data-form-engine]', _.debounce(function(event) {
              var params = $(event.target).data();
              
              event.preventDefault();
              FS.Forms.render(params.formId, params, params.formEngine || 'FS2');
            }, 100, true))
            .on('click', 'a[data-scroll-to]', function(event) {
              event.preventDefault();
              $('body').scrollTop($($(event.target).data('scroll-to')).offset().top);
            });
        };

        /**
         * getManifest
         * @return A promise to return the manifest for current app
         */
        App.prototype.getManifest = function() {
            var cachedManifest = getItem('SelfApp-' + this.appId);

            if(cachedManifest) {
                this.manifest = cachedManifest;
                return Promise.resolve(cachedManifest);
            }
            return FS.API.get('/manifest', {appId: this.appId }).bind(this)
                .then(function parseManifestFile(manifest) {
                    this.manifest = manifest;
                    setItem('SelfApp-' + this.appId, manifest);
                    return manifest;
                })
                .caught(function(errorThrown) {
                    throw new Error('Unexpected response (' + errorThrown +') when getting the manifest file for ' + this.appId + ' (' + this.url + ')');
                });
        };

        /**
         * load
         * @return A promise to have loaded all of the required templates and stylesheets, and to have started loading required scripts
         */
        App.prototype.load = function() {
            return this.getManifest().bind(this)
                .then(function readUrls(manifest) {
                        
                        if(_.isObject(manifest.requires)) {
                            _.extend(this.requires, manifest.requires);
                        }
                        if(manifest.pages) {
                            if(!this.options.page) {
                                _.each(manifest.pages, function(page) {
                                    if(_.isObject(page.requires)) {
                                        _.each(page.requires, function(value, prop) {
                                            this.requires[prop] = this.requires[prop].concat(value);
                                        }, this);
                                    }
                                    if(page.template && !page.templateGlobal) {
                                        this.requires.templates.push(page.template);
                                    }
                                }, this);
                            } else if(this.options.page) {
                                var thisPage =
                                    (_.isString(this.options.page) && _.findWhere(manifest.pages, { name: this.options.page }))
                                        || manifest.pages[this.options.page];

                                if(thisPage) {
                                    if(_.isObject(thisPage.requires)) {
                                        _.extend(this.requires, thisPage.requires);
                                    }
                                    if(thisPage.template && thisPage.templateGlobal !== undefined && !thisPage.templateGlobal) {
                                        this.requires.templates.push(thisPage.template);
                                    }
                                }
                            }
                        }
                        _.each(this.requires, function(value, prop) {
                            this.requires[prop] = _.uniq(value);
                        }, this);
                        return this.requires;
                    }
                )
                .then(function preloadContent(requires) {
                    var scriptsToLoad = requires.scripts || [];
                    var resourcesToLoad = { templates: requires.templates || [], styles: requires.styles || [] };

                    return Promise.all(_.map(scriptsToLoad, function(scriptFile) {
                        var url = this.url + 'scripts/' + scriptFile + '?_app=' + this.manifest.name;
                        return new Promise(function(resolve) {
                            yepnope({
                                load: url,
                                complete: resolve
                            });
                        });
                    }, this)).bind(this).then(function() {
                      var loadingTasks = [];
                      _.each(resourcesToLoad, function(paths, type) {
                          _.each(paths, function(path) {
                              var id = type + '/' + path;
                              var appName = this.manifest.name;
                              var loadTask;

                              if(type === 'templates') {
                                  loadTask = this.getTemplate(path);
                              } else if (type === 'styles') {
                                  var url = this.url + id + '?_app=' + appName;
                                  loadTask = new Promise(function(resolve) {
                                      yepnope.injectCss(url, resolve);
                                  });
                              }
                              loadingTasks.push(loadTask);
                          }, this);
                      }, this);
                      return Promise.all(loadingTasks);

                    });

                });
        };

        /**
         * getTemplate
         * @param name
         * @return A promise to return the requested template from the app's templates folder
         */
        App.prototype.getTemplate = _.memoize(function(name) {
            var url = this.url + 'templates/' + name;
            return Promise.resolve($.ajax(url))
                .then(function(source) {
                    return FS.Template().add(source, name);
                });
        });

        App.prototype.render = function(container, appOptions) {
            if (!container) {
                throw new Error('Render container is not specified');
            }
            var $container = $(container);       
            spinner($container, true);
            appOptions = appOptions || {};
            appOptions.params = appOptions.params || {};
            return displayApp.call(this, appOptions.page || appOptions.params.page || this.options.page, true, $container, appOptions);
        };

        App.prototype.getWidgetInstances = function(filter) {
            if (!this.manifest.provides || !this.manifest.widgets) {
                return [];
            }
            var providesNames = _.chain(this.manifest.provides)
                .filter(function(provide) {
                        return provide.type === filter && provide.widget;
                })
                .pluck('widget')
                .value();
            return _.map(_.filter(this.manifest.widgets, function(widget) {
                        return _.contains(providesNames, widget.name);
                    }, this),
                function(widget) {
                    widget.appId = this.appId;
                    widget.appUrl = this.url;
                    widget.appManifest = this.manifest;
                    widget.pageName = filter;
                    return widget;
                }
            , this);
        };

    };

    return App;

}));
