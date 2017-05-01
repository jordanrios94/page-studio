(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'jquery', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.RenderManager = factory(root._, root.jQuery, root.Promise);
    }
}(this, function(_, $, Promise) {
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');
    if(!Promise) throw new Error('Bluebird.js is not available');
    if(!FS.AppManager) throw new Error('FS.AppManager is not available');
    if(!FS.WidgetFactory) throw new Error('FS.WidgetFactory is not available');

    /**
     * A constructor
     */
    var RenderManager = function RenderManager() {

        RenderManager.prototype.render = function(page, config) {
            return Promise.resolve(_render(page, config))
            .caught(function(error) {
                return FS.Template('alert', {
                    alertClass: 'warning',
                    alertBody: error.message,
                    noClose: true
                }).into(config.target);
            });
        };

        RenderManager.prototype.initTemplatedFrame = function ($content) {
            if (!$content) return Promise.reject({ message: 'Container is not specified.'});
            var $body = $("body").removeClass("self-page-loading");
            $("div.content.container", $body).removeClass("container");
            var $stylesheets = $('link');

            _.each($stylesheets, function(element){
                var $element = $(element);
                    $element.attr('href', $element.attr('href') + '?iframe');
            });      

            $('#footer').remove();
            $('#navigation').remove();
            $content.css("display", "");
            var decodeParam = _.compose(decodeURI, getParam);
            var appName = decodeParam('appName');
            var templateName = appName + '/' + decodeParam("template");
            var widgetName = decodeParam('widgetName');
            var $parentContainer = $("#" + decodeParam('parentContainer'), window.parent.document);
            var appPageName = decodeParam('appPageName');
            var app;

            // Setup resize of iframe
            $parentContainer.contents().find('#self-content').resize(function(){
                var $this = $(this);
                var height = $this.height();
                $parentContainer.height(height+ "px");
                top.$('.loader').detach();
            });

            return FS.API.get('/apps2').then(function(result) {
                app = new FS.App(_.findWhere(result.apps, {name: appPageName}));
                return app;
            }).then(function(app) {
                return app.getManifest();
            }).then(function(manifest) {
                return app.getWidgetInstances(appPageName);
            }).then(function(wi) {
                return _.findWhere(wi, {name: widgetName});
            }).then(function(w) {
                var userWidgets = FS.API.get('/self-pages-config', {type: 'widget', page: appPageName});
                return Promise.all([(new FS.WidgetFactory()).createWidgets([w]), userWidgets]);
            }).spread(function(widgets, userWidgets) {
                if (widgets[0]) {
                    var widget = widgets[0];
                    var dbWidget = _.findWhere(userWidgets, { name: widget.name, app_id: widget.appId });
                    if (dbWidget) {
                        widget.widgetConfig = JSON.parse(dbWidget.config);
                        widget.widgetId = dbWidget.id;
                        widget.widgetSettings = JSON.parse(dbWidget.settings);
                    }
                    return widget.load();
                } else {
                    return Promise.reject({ message: 'Widget was not found.'});
                }
            }).then(function(widget) {
                var widgetContext = {
                    widget: {
                        name: widget.name,
                        id: widget.widgetId,
                        config: widget.widgetConfig
                    },
                    app: widget.appManifest,
                    baseUrl: widget.appUrl,
                    settings: widget.settings,
                    widgetSettings: widget.widgetSettings,
                    queryParams: windowSearchToObject({ searchParent: true })
                };
                return FS.Template(templateName, widgetContext).into($content);
            });
        };
            
        function _render(page, config) {
            config.method = config.method || "html";
            switch (config.type)
            {
                case 'page':
                    return renderPage(page, config);
                case 'widget':
                    return renderWidgets(page, config);
                default:
                    throw new Error('Rendering type is not defined.');
            }
        };

        function renderPage(page, config) {
            return FS.AppManager.get({ app_options: config.appOptions })
                .then(function(app) {
                    if(!app) {
                        throw new Error('Could not find the app, "' + config.appOptions.load + '". Please ensure it exists and is enabled on your site.');
                    }
                    return app.render(config.target, config.appOptions);
                });
        };

        function renderWidgets(page, config) {
            if (self === top) FS.Timer.markTime('WidgetsLoad', 'Widgets Loading');
            var $loader =  $('<div>').appendTo($(config.target));
            spinner($loader, true);


            var widgetCoreTemplate = 'widgetscontainer';
            var userWidgetsApiUrl = '/self-pages-config';


            return FS.AppManager.get()
                .then(function(apps) {
                    return FS.AppManager.getWidgetInstances(page);
                })
                .then(function(widgetsObjects) {
                    var allWidgets = (new FS.WidgetFactory()).createWidgets(widgetsObjects);
                    var userWidgets = FS.API.get(userWidgetsApiUrl, {type: 'widget', page: page});
                    return Promise.all([allWidgets, userWidgets]);
                })
                .spread(function(allWidgets, userWidgets) {
                    var widgetInstances = _.filter(allWidgets, function(element) {
                        return _.find(userWidgets, function(userWidget) {
                            return userWidget.app_id === element.appId && userWidget.name === element.name;
                        })
                    });
                    widgetInstances = _.map(widgetInstances, function(element) {
                        var userWidget = _.find(userWidgets, function(uw) {
                            return uw.name === element.name && uw.app_id === element.appId;
                        });
                        element.widgetConfig = JSON.parse(userWidget.config);
                        element.widgetId = userWidget.id;
                        element.widgetSettings = JSON.parse(userWidget.settings) || {};
                        return element;
                    });
                    return Promise.all(_.map(widgetInstances, function(widgetInstance) {
                        return widgetInstance.load();
                    }));
                })
                .then(function(widgetInstances) {
                    return getWidgetSettingsRole()
                    .then(function(hasSettings){
                        return Promise.all(_.map(widgetInstances, function(widgetInstance) {
                            widgetInstance.hasSettings = hasSettings;
                            return Promise.props(getWidgetContext(widgetInstance));
                        }));
                    });                    
                })
                .then(function(widgetResults) {
                    var result = _.chain(widgetResults)
                        .sort(function(element) { return element.config.location.order; })
                        .groupBy(function(element) { return element.config.location.row; })
                        .map(function(element) { return element; })
                        .value();

;                    return FS.Template(widgetCoreTemplate, { rows: result });

                })
                .then(function(html) {
                    $(config.target)[config.method](html).on('click', '.settings-btn', handler_settings);
                })
                .then(function(){
                    if (self === top) FS.Timer.markTime('WidgetsLoad', 'Widgets Ready');
                    /*
                    _.each($(".fs-external-widget"), function(iframeHtml) {
                        var height = $(iframeHtml).contents().find('body').height();
                        $(iframeHtml).attr('frameborder', 0);
                        $(iframeHtml).css('width', '100%');
                        $(iframeHtml).css('height', height+'px');

                    });

                    $(".fs-external-widget").contents().find('body').resize(function(){
                        var $this = $(this);
                        var height = $this.height();
                        $this.parent(".fs-external-widget").height(height+'px');
                    });
                    */

                    $loader.detach();
                });
        };

        function handler_settings(e){
            e.preventDefault();
            var $element = $(this),
                data = $element.data(),
                settingsEntry = $element.data('settings-entry');

            return FS.API.get('/self-pages-config', {widgetId: data['widgetId']}).then(function(widget){
                var context = {
                    settings: widget.settings,
                    appName: data['appName']
                }

                var modalSettings = {
                    modalTemplate: data['appName'] + '/' + settingsEntry,
                    modalTitle: 'Settings',
                    saveButton: 'Save Settings',
                    settings: widget.settings,
                    appName: data['appName'],
                    saveButtonClass: 'btn-save-admin-settings'
                    //appendToParentWindow: true,
                };

                return modal(modalSettings);
            }).then(function($modal){
                var $btnPrimary = $('.btn-primary', $modal).on('click', { 
                    $modal : $modal, 
                    data: data, 
                    $widgetContainer: $element.closest('.widget-container') }, handler_saveSettings);

                $('.settings-input', $modal).on('change', function(){
                    $btnPrimary.show();
                });                
            });
        };

        function handler_saveSettings(e){
            e.preventDefault();
            var $element = $(this);
            var $modalContent = $element.closest('.modal-content');
            var $settingsContainer = $modalContent.find('.settings-container');
            var $modalFooter = $modalContent.find('.modal-footer');
            var $modalButtons = $modalFooter.find('.btn').hide();

            var inputs = $modalContent.find('.settings-input');
            var settings = {};
            
            _.each(inputs, function(element){
                var $element = $(element);
                settings[$element.attr('name')] = JSON.parse($element.val());
            });          

            spinner($settingsContainer, true);

            return FS.API.put('/self-pages-config', {widgetId: e.data.data['widgetId']}, settings).then(function(response){
                e.data.$modal.modal('hide');
                reloadWidget(e.data.data['pageName'], e.data.data['appName'], e.data.data['widgetName'], e.data.$widgetContainer);
            }).caught(function(error){
                FS.Template('alert', {alertClass: 'danger', alertBody:error.message, noClose: true}).into($settingsContainer)
                .then(function(){
                    $modalButtons.siblings('.btn-default').show();
                });
            });
        }

        function reloadWidget(appPageName, appName, widgetName, $container){
            return FS.API.get('/apps2').then(function(result) {
                app = new FS.App(_.findWhere(result.apps, {name: appName}));
                return app;
            }).then(function(app) {
                return app.getManifest();
            }).then(function(manifest) {
                return app.getWidgetInstances(appPageName);
            }).then(function(wi) {
                return _.findWhere(wi, {name: widgetName});
            }).then(function(w) {
                var userWidgets = FS.API.get('/self-pages-config', {type: 'widget', page: appPageName});
                return Promise.all([(new FS.WidgetFactory()).createWidgets([w]), userWidgets]);
            }).spread(function(widgets, userWidgets) {
                if (widgets[0]) {
                    var widget = widgets[0];
                    var dbWidget = _.findWhere(userWidgets, { name: widget.name, app_id: widget.appId });
                    if (dbWidget) {
                        widget.widgetConfig = JSON.parse(dbWidget.config);
                        widget.widgetId = dbWidget.id;
                        widget.widgetSettings = JSON.parse(dbWidget.settings) || {};
                    }
                    return widget.load();
                } else {
                    return Promise.reject({ message: 'Widget was not found.'});
                }
            })
            .then(function(widget) {
                return getWidgetSettingsRole()
                    .then(function(hasSettings){
                        widget.hasSettings = hasSettings;
                        return Promise.props(getWidgetContext(widget));
                    });                
            }).then(function(widgetContext){
                return FS.Template('widget', widgetContext).into($container);
            });
        }

        function getWidgetSettingsRole(){
            return FS.SecurityManager.hasRole('self', 'widget_settings', 'admin_widgets')
                .then(function() {
                    return true;
                })
                .caught(function(error) {
                    return false;
                });
        }

        function getObjectFromString(str) {
            if (!_.isObject(str)) {    
                try {
                    return JSON.parse("'" +  value + "'");
                } catch(e) {
                    return {}
                }
            }
            return str;
        }

        function getWidgetContext(widget){
            return {
                config: widget.widgetConfig,
                type: widget.type,
                id: widget.widgetId,
                appId: widget.appId,
                appName: widget.appManifest.name,
                pageName: widget.pageName,
                widgetName: widget.name,
                settings: widget.settings,
                hasSettings: widget.hasSettings && widget.settings,
                settingsEntry: widget.settings ? widget.settings.entry : null,
                content: widget.render()
            }
        }
    };

    return new RenderManager();

}));
